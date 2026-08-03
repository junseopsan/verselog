import type { Entry } from "./types";
import { prevDateKey } from "./date";

export type WeeklyReport = {
  /** 오래된 날 → 오늘 순서의 7일 키 */
  days: { date: string; recorded: boolean }[];
  recordedDays: number;
  totalEntries: number;
  /** 변주(myLines)까지 쓴 기록 비율 (기록이 없으면 0) */
  myLinesRate: number;
  topMoods: { mood: string; count: number }[];
  /** 이번 주 마음에 든 기록의 좋았던 표현/변주 */
  favoriteLines: { id: string; text: string }[];
};

export function computeWeeklyReport(
  entries: Entry[],
  todayKey: string,
): WeeklyReport {
  const keys: string[] = [];
  let cursor = todayKey;
  for (let i = 0; i < 7; i++) {
    keys.unshift(cursor);
    cursor = prevDateKey(cursor);
  }
  const keySet = new Set(keys);
  const weekEntries = entries.filter((e) => keySet.has(e.date));
  const recordedDates = new Set(weekEntries.map((e) => e.date));

  const moodCounts = new Map<string, number>();
  for (const e of weekEntries) {
    for (const m of e.moods) moodCounts.set(m, (moodCounts.get(m) ?? 0) + 1);
  }
  const topMoods = [...moodCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([mood, count]) => ({ mood, count }));

  const withMyLines = weekEntries.filter((e) => e.myLines?.trim()).length;

  const favoriteLines = weekEntries
    .filter((e) => e.isFavorite)
    .map((e) => ({
      id: e.id,
      text: (e.myLines?.trim() || e.favoriteExpression?.trim() || e.copiedLyrics).split("\n")[0],
    }));

  return {
    days: keys.map((date) => ({ date, recorded: recordedDates.has(date) })),
    recordedDays: recordedDates.size,
    totalEntries: weekEntries.length,
    myLinesRate:
      weekEntries.length === 0
        ? 0
        : Math.round((withMyLines / weekEntries.length) * 100),
    topMoods,
    favoriteLines,
  };
}
