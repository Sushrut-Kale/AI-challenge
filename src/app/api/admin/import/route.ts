// ============================================================================
// AGENTCRAFT — Admin CSV Import API Route
// Parses Unstop registration exports, validates rows, detects duplicates,
// creates teams & members, and records import batches.
// POST /api/admin/import
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getServiceClient, isAdminUser, logAuditEvent } from '@/lib/supabase-server';
import Papa from 'papaparse';

interface ParsedRow {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone?: string;
  college?: string;
  track?: string;
  members: Array<{ name: string; email?: string; phone?: string; role?: string }>;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const user = await getCurrentUser();

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: 'Multipart form data is required.' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No CSV file provided.' }, { status: 400 });
    }

    const csvText = await file.text();
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
    });

    if (parseResult.errors.length > 0 && parseResult.data.length === 0) {
      return NextResponse.json(
        { error: 'Failed to parse CSV file: ' + parseResult.errors[0]?.message },
        { status: 400 }
      );
    }

    const rows = parseResult.data as Record<string, string>[];
    const serviceClient = getServiceClient();

    // Fetch existing emails to prevent duplicates
    const { data: existingTeams } = await serviceClient
      .from('teams')
      .select('leader_email, team_name');

    const existingEmails = new Set(existingTeams?.map((t) => t.leader_email.toLowerCase()) || []);
    const existingTeamNames = new Set(existingTeams?.map((t) => t.team_name.toLowerCase()) || []);

    const validTeamsToInsert: ParsedRow[] = [];
    const duplicates: Array<{ row: number; teamName: string; email: string; reason: string }> = [];
    const errors: Array<{ row: number; error: string }> = [];

    // Track emails in this upload to detect batch duplicates
    const batchEmails = new Set<string>();

    // Get the latest sequence number for AC-2026-XXXX format
    const { data: latestTeam } = await serviceClient
      .from('teams')
      .select('team_id')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let nextSequence = 1;
    if (latestTeam?.team_id) {
      const match = latestTeam.team_id.match(/AC-2026-(\d+)/);
      if (match) {
        nextSequence = parseInt(match[1], 10) + 1;
      }
    }

    rows.forEach((row, index) => {
      const rowNum = index + 2; // account for 1-based index and header line

      // Dynamic header mapping
      const teamName = (
        row['team name'] ||
        row['team_name'] ||
        row['team'] ||
        ''
      ).trim();

      const leaderName = (
        row['team leader name'] ||
        row['leader name'] ||
        row['team leader'] ||
        row['leader'] ||
        row['name'] ||
        ''
      ).trim();

      const leaderEmail = (
        row['team leader email'] ||
        row['leader email'] ||
        row['email'] ||
        row['email address'] ||
        ''
      ).trim().toLowerCase();

      const leaderPhone = (
        row['team leader mobile'] ||
        row['leader mobile'] ||
        row['mobile'] ||
        row['phone'] ||
        row['contact'] ||
        ''
      ).trim();

      const college = (
        row['college name'] ||
        row['college'] ||
        row['institute'] ||
        row['organization'] ||
        ''
      ).trim();

      const track = (
        row['track'] ||
        row['theme'] ||
        row['problem statement'] ||
        row['category'] ||
        'General SDG Track'
      ).trim();

      if (!teamName || !leaderName || !leaderEmail) {
        errors.push({
          row: rowNum,
          error: 'Missing required field (Team Name, Leader Name, or Leader Email)',
        });
        return;
      }

      if (!leaderEmail.includes('@') || !leaderEmail.includes('.')) {
        errors.push({
          row: rowNum,
          error: `Invalid email address format: ${leaderEmail}`,
        });
        return;
      }

      // Check duplicates
      if (existingEmails.has(leaderEmail)) {
        duplicates.push({ row: rowNum, teamName, email: leaderEmail, reason: 'Email already registered in database' });
        return;
      }

      if (batchEmails.has(leaderEmail)) {
        duplicates.push({ row: rowNum, teamName, email: leaderEmail, reason: 'Duplicate email within this CSV file' });
        return;
      }

      batchEmails.add(leaderEmail);

      // Extract members (Member 2, 3, 4)
      const members: Array<{ name: string; email?: string; phone?: string; role?: string }> = [
        { name: leaderName, email: leaderEmail, phone: leaderPhone, role: 'Leader' },
      ];

      for (let m = 2; m <= 5; m++) {
        const memName = (row[`member ${m} name`] || row[`member_${m}_name`] || '').trim();
        const memEmail = (row[`member ${m} email`] || row[`member_${m}_email`] || '').trim();
        const memPhone = (row[`member ${m} mobile`] || row[`member_${m}_mobile`] || '').trim();

        if (memName) {
          members.push({
            name: memName,
            email: memEmail || undefined,
            phone: memPhone || undefined,
            role: `Member ${m}`,
          });
        }
      }

      validTeamsToInsert.push({
        teamName,
        leaderName,
        leaderEmail,
        leaderPhone,
        college,
        track,
        members,
      });
    });

    // Record import batch
    const { data: importRecord, error: importError } = await serviceClient
      .from('registration_imports')
      .insert({
        filename: file.name,
        total_rows: rows.length,
        imported_count: validTeamsToInsert.length,
        skipped_count: duplicates.length + errors.length,
        imported_by: user.id,
      })
      .select()
      .single();

    if (importError) {
      console.error('[IMPORT] Failed to record import batch:', importError);
    }

    // Insert valid teams and members
    const createdTeams: Array<{ team_id: string; team_name: string; leader_email: string }> = [];

    for (const team of validTeamsToInsert) {
      const teamIdFormatted = `AC-2026-${String(nextSequence).padStart(4, '0')}`;
      nextSequence++;

      const { data: insertedTeam, error: teamInsertError } = await serviceClient
        .from('teams')
        .insert({
          team_id: teamIdFormatted,
          team_name: team.teamName,
          leader_name: team.leaderName,
          leader_email: team.leaderEmail,
          leader_phone: team.leaderPhone || null,
          college: team.college || null,
          track: team.track,
          registration_source: 'unstop',
          is_active: true,
        })
        .select()
        .single();

      if (teamInsertError || !insertedTeam) {
        errors.push({ row: 0, error: `Failed to insert team "${team.teamName}": ${teamInsertError?.message}` });
        continue;
      }

      // Insert members
      const memberInserts = team.members.map((m) => ({
        team_id: insertedTeam.id,
        name: m.name,
        email: m.email || null,
        phone: m.phone || null,
        role: m.role || 'Member',
      }));

      await serviceClient.from('team_members').insert(memberInserts);

      createdTeams.push({
        team_id: teamIdFormatted,
        team_name: team.teamName,
        leader_email: team.leaderEmail,
      });
    }

    await logAuditEvent(
      user.id,
      'csv_imported',
      'registration_import',
      importRecord?.id || null,
      {
        filename: file.name,
        total: rows.length,
        imported: createdTeams.length,
        duplicates: duplicates.length,
        errors: errors.length,
      },
      ip
    );

    return NextResponse.json({
      success: true,
      summary: {
        totalRows: rows.length,
        imported: createdTeams.length,
        duplicateCount: duplicates.length,
        errorCount: errors.length,
      },
      createdTeams,
      duplicates,
      errors,
    });
  } catch (err: unknown) {
    console.error('[ADMIN/IMPORT] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Import failed unexpectedly.' },
      { status: 500 }
    );
  }
}
