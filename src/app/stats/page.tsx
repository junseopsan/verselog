"use client";

import { useEntries } from "@/lib/useEntries";
import { computeStats } from "@/lib/streak";
import { getEffectiveDateKey } from "@/lib/date";
import { computeWeeklyReport } from "@/lib/report";
import StatTile from "@/components/StatTile";

export default function StatsPage() {
  const { entries } = useEntries();

  if (entries === null) {
    return <div className="mt-2 h-96 animate-pulse rounded-2xl bg-surface" />;
  }

  const todayKey = getEffectiveDateKey();
  const stats = computeStats(entries, todayKey);
  const weekly = computeWeeklyReport(entries, todayKey);

  const moodCounts = new Map<string, number>();
  for (const e of entries) {
    for (const m of e.moods) moodCounts.set(m, (moodCounts.get(m) ?? 0) + 1);
  }
  const topMoods = [...moodCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const favoriteCount = entries.filter((e) => e.isFavorite).length;
  const withMyLines = entries.filter((e) => e.myLines?.trim()).length;

  return (
    <div className="space-y-8">
      <header className="pt-2">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">통계</h1>
        <div aria-hidden className="mt-3 h-px w-10 bg-accent/70" />
      </header>

      <section className="space-y-3 rounded-2xl border border-edge bg-surface p-5">
        <h2 className="text-sm font-semibold">이번 주 리포트</h2>
        <div className="flex items-center justify-between">
          {weekly.days.map((d) => (
            <div key={d.date} className="flex flex-col items-center gap-1">
              <span
                className={`h-3 w-3 rounded-full transition-colors ${
                  d.recorded
                    ? "bg-accent shadow-[0_0_8px] shadow-accent/50"
                    : "bg-edge"
                }`}
              />
              <span className="text-[10px] text-muted">{d.date.slice(8)}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">
          7일 중 <span className="text-accent">{weekly.recordedDays}일</span>{" "}
          기록 · 총 {weekly.totalEntries}건 · 변주 작성률 {weekly.myLinesRate}%
        </p>
        {weekly.topMoods.length > 0 && (
          <p className="text-sm text-muted">
            자주 고른 분위기:{" "}
            {weekly.topMoods.map((m) => `${m.mood}(${m.count})`).join(" · ")}
          </p>
        )}
        {weekly.favoriteLines.length > 0 && (
          <div className="space-y-1 border-t border-edge pt-3">
            <p className="text-xs text-muted">이번 주 마음에 든 문장</p>
            {weekly.favoriteLines.map((line) => (
              <p key={line.id} className="font-serif text-sm leading-relaxed">
                {line.text}
              </p>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatTile label="총 기록" value={stats.totalEntries} suffix="개" />
        <StatTile label="기록한 날" value={stats.totalDays} suffix="일" />
        <StatTile label="현재 연속" value={stats.currentStreak} suffix="일" />
        <StatTile label="최고 연속" value={stats.bestStreak} suffix="일" />
        <StatTile label="마음에 든 기록" value={favoriteCount} suffix="개" />
        <StatTile label="변주까지 쓴 기록" value={withMyLines} suffix="개" />
      </section>

      {topMoods.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted">자주 고른 분위기</h2>
          <div className="space-y-2">
            {topMoods.map(([mood, count]) => (
              <div key={mood} className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-sm">{mood}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent/40 to-accent/90 transition-[width] duration-500"
                    style={{ width: `${(count / topMoods[0][1]) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
