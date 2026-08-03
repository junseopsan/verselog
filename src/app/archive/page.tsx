"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEntries } from "@/lib/useEntries";
import { MOODS } from "@/lib/constants";
import EntryCard from "@/components/EntryCard";

export default function ArchivePage() {
  return (
    <Suspense>
      <ArchiveInner />
    </Suspense>
  );
}

function ArchiveInner() {
  const searchParams = useSearchParams();
  const { entries } = useEntries();
  const [mood, setMood] = useState<string | null>(null);
  const [favoriteOnly, setFavoriteOnly] = useState(
    searchParams.get("favorite") === "1",
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (entries === null) return [];
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => !mood || e.moods.includes(mood))
      .filter((e) => !favoriteOnly || e.isFavorite)
      .filter((e) => {
        if (!q) return true;
        return [
          e.songTitle,
          e.artist,
          e.copiedLyrics,
          e.favoriteExpression,
          e.reason,
          e.myLines,
          e.memo,
        ]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(q));
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }, [entries, mood, favoriteOnly, query]);

  if (entries === null) {
    return <div className="mt-2 h-96 animate-pulse rounded-2xl bg-surface" />;
  }

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          보관함
        </h1>
        <div aria-hidden className="mt-3 h-px w-10 bg-accent/70" />
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="곡명, 가사, 내 문장 검색"
        className="w-full rounded-lg border border-edge bg-surface px-3 py-2.5 text-[15px] transition-colors duration-200 placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        <FilterChip
          active={favoriteOnly}
          onClick={() => setFavoriteOnly((v) => !v)}
        >
          ★ 마음에 든 것만
        </FilterChip>
        {MOODS.map((m) => (
          <FilterChip
            key={m}
            active={mood === m}
            onClick={() => setMood((cur) => (cur === m ? null : m))}
          >
            {m}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        entries.length === 0 ? (
          <div className="flex flex-col items-center gap-4 pt-14 text-center">
            <span aria-hidden className="font-serif text-5xl leading-none text-accent/25">
              &ldquo;
            </span>
            <div className="space-y-1">
              <p className="text-sm text-foreground/80">아직 기록이 없어요.</p>
              <p className="text-sm text-muted">오늘의 한 줄부터 시작해봐요.</p>
            </div>
            <Link
              href="/write"
              className="press rounded-full border border-accent/50 px-5 py-2.5 text-sm font-semibold text-accent"
            >
              첫 기록 남기기
            </Link>
          </div>
        ) : (
          <p className="pt-16 text-center text-sm text-muted">
            조건에 맞는 기록이 없어요.
          </p>
        )
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press min-h-9 shrink-0 rounded-full border px-3.5 text-sm ${
        active
          ? "border-accent bg-accent/15 text-accent"
          : "border-edge bg-surface text-muted"
      }`}
    >
      {children}
    </button>
  );
}
