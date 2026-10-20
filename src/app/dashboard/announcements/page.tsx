'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_ANNOUNCEMENTS, AnnouncementItem } from '@/data/dashboardMock';
import { getAnnouncements } from '@/lib/supabase';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);

  useEffect(() => {
    getAnnouncements().then(setAnnouncements).catch(() => {});
  }, []);
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="pb-4 border-b-2 border-[#3d240e]">
        <span className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest block font-bold mb-1">
          ORGANIZING DESK BROADCASTS
        </span>
        <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase font-bold tracking-wide">
          OFFICIAL ANNOUNCEMENTS & BULLETINS
        </h1>
        <p className="text-xs text-neutral-300 font-sans mt-0.5">
          Real-time updates directly from ASTRA Student Association, AlgoVedas, and AAAI Global Chapter.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className={`p-5 border-2 relative ${
              item.tag === 'CRITICAL'
                ? 'border-red-600 bg-[#240b08] shadow-[inset_2px_2px_0_#54140d,0_8px_20px_rgba(0,0,0,0.6)]'
                : 'border-[#472c15] bg-[#160d05]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-[#2d1a0b]">
              <div className="flex items-center gap-2">
                <span
                  className={`font-pixel text-[8px] px-2 py-0.5 rounded font-bold uppercase ${
                    item.tag === 'CRITICAL'
                      ? 'bg-red-950 text-red-300 border border-red-500'
                      : item.tag === 'RESOURCES'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500'
                      : 'bg-sky-950 text-sky-300 border border-sky-500'
                  }`}
                >
                  {item.tag}
                </span>
                <h3 className="font-pixel text-sm text-white font-bold">{item.title}</h3>
              </div>
              <span className="font-pixel text-[9px] text-neutral-400">{item.date}</span>
            </div>

            <p className="text-xs text-neutral-200 font-sans leading-relaxed">{item.content}</p>

            {item.link && (
              <div className="mt-3 pt-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/80 bg-[#2b1708] hover:bg-[#3d200b] font-pixel text-[9px] text-amber-300 uppercase font-bold"
                >
                  <span>{item.linkText || 'Open Resource'}</span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
