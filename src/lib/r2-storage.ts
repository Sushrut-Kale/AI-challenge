// ============================================================================
// AGENTCRAFT — Cloudflare R2 Storage Utilities
// S3-compatible presigned URL generation for private file uploads/downloads.
// ============================================================================

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ----- Configuration -----

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      'Missing R2 configuration. Required env vars: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME'
    );
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

let _s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (_s3Client) return _s3Client;

  const { accountId, accessKeyId, secretAccessKey } = getR2Config();

  _s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return _s3Client;
}

// ----- File Validation -----

// Allowed MIME types for each file type
export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  pitch_deck: [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  report: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  supporting: [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/zip',
    'application/x-zip-compressed',
  ],
};

// Max file sizes in bytes
export const MAX_FILE_SIZES: Record<string, number> = {
  pitch_deck: 50 * 1024 * 1024, // 50 MB
  report: 30 * 1024 * 1024,      // 30 MB
  supporting: 25 * 1024 * 1024,  // 25 MB
};

// Allowed file extensions
export const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  pitch_deck: ['.pdf', '.ppt', '.pptx'],
  report: ['.pdf', '.doc', '.docx'],
  supporting: ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.zip'],
};

export function validateFile(
  fileName: string,
  mimeType: string,
  fileSize: number,
  fileType: string
): { valid: boolean; error?: string } {
  // Check file type category is valid
  if (!ALLOWED_MIME_TYPES[fileType]) {
    return { valid: false, error: `Invalid file type category: ${fileType}` };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES[fileType].includes(mimeType)) {
    return {
      valid: false,
      error: `File type "${mimeType}" is not allowed for ${fileType}. Allowed: ${ALLOWED_EXTENSIONS[fileType].join(', ')}`,
    };
  }

  // Check file extension
  const ext = '.' + fileName.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS[fileType].includes(ext)) {
    return {
      valid: false,
      error: `File extension "${ext}" is not allowed for ${fileType}. Allowed: ${ALLOWED_EXTENSIONS[fileType].join(', ')}`,
    };
  }

  // Check file size
  const maxSize = MAX_FILE_SIZES[fileType];
  if (fileSize > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size (${Math.round(fileSize / (1024 * 1024))} MB) exceeds the ${maxMB} MB limit for ${fileType}`,
    };
  }

  return { valid: true };
}

// ----- Object Key Generation -----

/**
 * Generate a safe R2 object key for a team's submission file.
 * Format: submissions/{team_id}/{submission_id}/{file_type}/{timestamp}_{sanitized_name}
 */
export function generateObjectKey(
  teamId: string,
  submissionId: string,
  fileType: string,
  fileName: string
): string {
  // Sanitize filename: keep only alphanumeric, dots, hyphens, underscores
  const sanitized = fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);

  const timestamp = Date.now();
  return `submissions/${teamId}/${submissionId}/${fileType}/${timestamp}_${sanitized}`;
}

// ----- Presigned URLs -----

/**
 * Generate a short-lived presigned URL for uploading a file to R2.
 * URL expires in 10 minutes.
 */
export async function getPresignedUploadUrl(
  objectKey: string,
  mimeType: string,
  fileSize: number
): Promise<string> {
  const client = getS3Client();
  const { bucketName } = getR2Config();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: mimeType,
    ContentLength: fileSize,
  });

  return getSignedUrl(client, command, { expiresIn: 600 }); // 10 minutes
}

/**
 * Generate a short-lived presigned URL for downloading a file from R2.
 * URL expires in 30 minutes.
 */
export async function getPresignedDownloadUrl(objectKey: string): Promise<string> {
  const client = getS3Client();
  const { bucketName } = getR2Config();

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  return getSignedUrl(client, command, { expiresIn: 1800 }); // 30 minutes
}

/**
 * Delete an object from R2.
 */
export async function deleteR2Object(objectKey: string): Promise<void> {
  const client = getS3Client();
  const { bucketName } = getR2Config();

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  await client.send(command);
}
