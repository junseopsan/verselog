create table public.entries (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  song_title text,
  artist text,
  copied_lyrics text not null,
  favorite_expression text,
  reason text,
  my_lines text,
  moods text[] not null default '{}',
  memo text,
  is_favorite boolean not null default false,
  checklist boolean[] not null default '{false,false,false,false,false}',
  is_hook_candidate boolean not null default false,
  ai_feedback jsonb,
  ai_feedback_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index entries_user_date_idx on public.entries (user_id, date desc);
create index entries_user_hook_idx on public.entries (user_id) where is_hook_candidate;

alter table public.entries enable row level security;

create policy "select own entries" on public.entries
  for select using (auth.uid() = user_id);
create policy "insert own entries" on public.entries
  for insert with check (auth.uid() = user_id);
create policy "update own entries" on public.entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own entries" on public.entries
  for delete using (auth.uid() = user_id);
