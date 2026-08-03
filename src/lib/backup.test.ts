import { describe, expect, it } from "vitest";
import { mergeEntries, parseBackup } from "./backup";
import type { Entry } from "./types";

function entry(id: string, updatedAt: string, copiedLyrics = "가사"): Entry {
  return {
    id,
    date: "2026-08-01",
    copiedLyrics,
    moods: [],
    isFavorite: false,
    isHookCandidate: false,
    checklist: [false, false, false, false, false],
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt,
  };
}

describe("parseBackup", () => {
  it("정상 백업 파일을 파싱한다", () => {
    const file = JSON.stringify({
      app: "verse-log",
      schemaVersion: 1,
      exportedAt: "2026-08-01T12:00:00.000Z",
      entries: [entry("a", "2026-08-01T11:00:00.000Z")],
    });
    const result = parseBackup(file);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a");
  });

  it("JSON이 아니면 에러", () => {
    expect(() => parseBackup("not json")).toThrow("손상");
  });

  it("다른 앱의 파일이면 에러", () => {
    expect(() =>
      parseBackup(JSON.stringify({ app: "other", entries: [] })),
    ).toThrow("백업 파일이 아닙니다");
  });

  it("필수 필드가 없는 기록이 있으면 에러", () => {
    expect(() =>
      parseBackup(
        JSON.stringify({ app: "verse-log", entries: [{ id: "a" }] }),
      ),
    ).toThrow("필수 항목");
  });

  it("누락된 선택 필드는 기본값으로 보정한다", () => {
    const result = parseBackup(
      JSON.stringify({
        app: "verse-log",
        entries: [{ id: "a", date: "2026-08-01", copiedLyrics: "가사" }],
      }),
    );
    expect(result[0].moods).toEqual([]);
    expect(result[0].checklist).toHaveLength(5);
    expect(result[0].isFavorite).toBe(false);
  });
});

describe("mergeEntries", () => {
  it("id가 다르면 합쳐진다", () => {
    const merged = mergeEntries(
      [entry("a", "2026-08-01T11:00:00.000Z")],
      [entry("b", "2026-08-01T11:00:00.000Z")],
    );
    expect(merged).toHaveLength(2);
  });

  it("id 충돌 시 updatedAt이 최신인 쪽이 남는다", () => {
    const current = entry("a", "2026-08-01T11:00:00.000Z", "옛 버전");
    const imported = entry("a", "2026-08-01T12:00:00.000Z", "새 버전");
    const merged = mergeEntries([current], [imported]);
    expect(merged).toHaveLength(1);
    expect(merged[0].copiedLyrics).toBe("새 버전");
  });

  it("가져온 쪽이 더 오래됐으면 기존 것이 남는다", () => {
    const current = entry("a", "2026-08-01T12:00:00.000Z", "현재 버전");
    const imported = entry("a", "2026-08-01T11:00:00.000Z", "옛 백업");
    const merged = mergeEntries([current], [imported]);
    expect(merged[0].copiedLyrics).toBe("현재 버전");
  });
});
