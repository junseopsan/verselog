-- 기록 유형: 노래(song) 또는 책(book). 기존 기록은 전부 노래.
alter table public.entries
  add column source_type text not null default 'song'
  check (source_type in ('song', 'book'));
