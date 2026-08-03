import { describe, expect, it } from "vitest";
import { computeWeeklyReport } from "./report";
import type { Entry } from "./types";

function entryOn(date: string, extra: Partial<Entry> = {}): Entry {
  return {
    id: crypto.randomUUID(),
    date,
    copiedLyrics: "가사",
    moods: [],
    isFavorite: false,
    isHookCandidate: false,
    checklist: [false, false, false, false, false],
    createdAt: `${date}T12:00:00.000Z`,
    updatedAt: `${date}T12:00:00.000Z`,
    ...extra,
  };
}

const TODAY = "2026-08-01";

describe("computeWeeklyReport", () => {
  it("빈 배열이면 0으로 채워진다", () => {
    const r = computeWeeklyReport([], TODAY);
    expect(r.days).toHaveLength(7);
    expect(r.days[6].date).toBe(TODAY);
    expect(r.days[0].date).toBe("2026-07-26");
    expect(r.recordedDays).toBe(0);
    expect(r.myLinesRate).toBe(0);
  });

  it("7일 밖의 기록은 제외된다", () => {
    const r = computeWeeklyReport(
      [entryOn("2026-07-25"), entryOn("2026-07-26")],
      TODAY,
    );
    expect(r.totalEntries).toBe(1);
    expect(r.recordedDays).toBe(1);
  });

  it("하루 2건은 recordedDays 1일, totalEntries 2건", () => {
    const r = computeWeeklyReport([entryOn(TODAY), entryOn(TODAY)], TODAY);
    expect(r.recordedDays).toBe(1);
    expect(r.totalEntries).toBe(2);
  });

  it("변주 작성률과 분위기 top3를 계산한다", () => {
    const r = computeWeeklyReport(
      [
        entryOn(TODAY, { myLines: "한 줄", moods: ["밤", "그리움"] }),
        entryOn("2026-07-31", { moods: ["밤"] }),
      ],
      TODAY,
    );
    expect(r.myLinesRate).toBe(50);
    expect(r.topMoods[0]).toEqual({ mood: "밤", count: 2 });
  });

  it("즐겨찾기 기록의 문장을 모은다 (변주 우선, 첫 줄만)", () => {
    const r = computeWeeklyReport(
      [
        entryOn(TODAY, {
          isFavorite: true,
          myLines: "첫 줄\n둘째 줄",
        }),
        entryOn("2026-07-30", {
          isFavorite: true,
          favoriteExpression: "좋았던 표현",
        }),
      ],
      TODAY,
    );
    expect(r.favoriteLines.map((f) => f.text)).toEqual(["첫 줄", "좋았던 표현"]);
  });
});
