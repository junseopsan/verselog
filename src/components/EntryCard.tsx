"use client";

import Link from "next/link";
import type { Entry } from "@/lib/types";
import { formatKeyForDisplay } from "@/lib/date";

export default function EntryCard({ entry }: { entry: Entry }) {
  const preview = entry.myLines?.trim() || entry.copiedLyrics.trim();

  return (
    <Link
      href={`/entry?id=${entry.id}`}
      className="press block rounded-xl border border-edge bg-surface p-4 hover:border-accent/30 active:border-accent/50"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span>{formatKeyForDisplay(entry.date)}</span>
        {entry.isFavorite && <span className="text-accent">★</span>}
      </div>
      {(entry.songTitle || entry.artist) && (
        <p className="mt-1 text-xs text-muted">
          {[entry.songTitle, entry.artist].filter(Boolean).join(" · ")}
        </p>
      )}
      <p className="mt-2 line-clamp-2 whitespace-pre-wrap font-serif text-base leading-relaxed">
        {preview}
      </p>
      {entry.moods.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.moods.map((mood) => (
            <span
              key={mood}
              className="rounded-full border border-edge px-2 py-0.5 text-[11px] text-muted"
            >
              {mood}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
