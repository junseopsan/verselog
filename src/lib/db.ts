import { supabase } from "./supabase";
import type { AiFeedback, Entry } from "./types";

/** entries 테이블 row (snake_case). user_id는 DB default(auth.uid())로 채워진다. */
export type EntryRow = {
  id: string;
  date: string;
  song_title: string | null;
  artist: string | null;
  copied_lyrics: string;
  favorite_expression: string | null;
  reason: string | null;
  my_lines: string | null;
  moods: string[];
  memo: string | null;
  is_favorite: boolean;
  is_hook_candidate: boolean;
  checklist: boolean[];
  ai_feedback: AiFeedback | null;
  ai_feedback_at: string | null;
  created_at: string;
  updated_at: string;
};

export function toRow(entry: Entry): Omit<EntryRow, "ai_feedback" | "ai_feedback_at"> {
  return {
    id: entry.id,
    date: entry.date,
    song_title: entry.songTitle ?? null,
    artist: entry.artist ?? null,
    copied_lyrics: entry.copiedLyrics,
    favorite_expression: entry.favoriteExpression ?? null,
    reason: entry.reason ?? null,
    my_lines: entry.myLines ?? null,
    moods: entry.moods,
    memo: entry.memo ?? null,
    is_favorite: entry.isFavorite,
    is_hook_candidate: entry.isHookCandidate,
    checklist: entry.checklist,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  };
}

export function fromRow(row: EntryRow): Entry {
  return {
    id: row.id,
    date: row.date,
    songTitle: row.song_title ?? undefined,
    artist: row.artist ?? undefined,
    copiedLyrics: row.copied_lyrics,
    favoriteExpression: row.favorite_expression ?? undefined,
    reason: row.reason ?? undefined,
    myLines: row.my_lines ?? undefined,
    moods: row.moods,
    memo: row.memo ?? undefined,
    isFavorite: row.is_favorite,
    isHookCandidate: row.is_hook_candidate,
    checklist: row.checklist,
    aiFeedback: row.ai_feedback,
    aiFeedbackAt: row.ai_feedback_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class DbError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

function throwOn(error: { message: string; code?: string } | null, status?: number): void {
  if (error) throw new DbError(error.message, status);
}

export async function fetchAll(): Promise<Entry[]> {
  const { data, error, status } = await supabase
    .from("entries")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  throwOn(error, status);
  return (data as EntryRow[]).map(fromRow);
}

export async function insertEntry(entry: Entry): Promise<void> {
  const { error, status } = await supabase.from("entries").insert(toRow(entry));
  throwOn(error, status);
}

export async function updateEntryRow(entry: Entry): Promise<void> {
  const { error, status } = await supabase
    .from("entries")
    .update(toRow(entry))
    .eq("id", entry.id);
  throwOn(error, status);
}

export async function deleteEntryRow(id: string): Promise<void> {
  const { error, status } = await supabase.from("entries").delete().eq("id", id);
  throwOn(error, status);
}

/** 백업 가져오기용. RLS 때문에 남의 id는 실패하므로 건별로 시도하고 실패 수를 반환한다. */
export async function upsertEntries(entries: Entry[]): Promise<number> {
  let failed = 0;
  for (const entry of entries) {
    const { error } = await supabase
      .from("entries")
      .upsert(toRow(entry), { onConflict: "id" });
    if (error) failed++;
  }
  return failed;
}
