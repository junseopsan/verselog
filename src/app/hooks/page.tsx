"use client";

import Link from "next/link";
import { useEntries } from "@/lib/useEntries";
import { formatKeyForDisplay } from "@/lib/date";

export default function HooksPage() {
  const { entries } = useEntries();

  if (entries === null) {
    return <div className="mt-2 h-96 animate-pulse rounded-2xl bg-surface" />;
  }

  const hooks = entries.filter((e) => e.isHookCandidate);

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          후렴 후보
        </h1>
        <p className="mt-1.5 text-xs text-muted">
          후렴처럼 반복하고 싶은 문장들을 모아둔 곳이에요.
        </p>
        <div aria-hidden className="mt-3 h-px w-10 bg-accent/70" />
      </header>

      {hooks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 pt-14 text-center">
          <span aria-hidden className="font-serif text-5xl leading-none text-accent/25">
            ♪
          </span>
          <div className="space-y-1">
            <p className="text-sm text-foreground/80">아직 후렴 후보가 없어요.</p>
            <p className="text-sm text-muted">
              기록에서 마음에 드는 문장을 후렴 후보로 표시해보세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {hooks.map((entry) => (
            <Link
              key={entry.id}
              href={`/entry?id=${entry.id}`}
              className="press relative block overflow-hidden rounded-xl border border-accent/30 bg-surface p-4 hover:border-accent/60 active:border-accent"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-3 top-1 font-serif text-5xl leading-none text-accent/10"
              >
                &ldquo;
              </span>
              <p className="whitespace-pre-wrap font-serif text-[16px] leading-loose">
                {entry.myLines?.trim() ||
                  entry.favoriteExpression?.trim() ||
                  entry.copiedLyrics}
              </p>
              <p className="mt-3 text-xs text-muted">
                {formatKeyForDisplay(entry.date)}
                {(entry.songTitle || entry.artist) &&
                  ` · ${[entry.songTitle, entry.artist].filter(Boolean).join(" · ")}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
