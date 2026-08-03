alter policy "select own entries" on public.entries
  using ((select auth.uid()) = user_id);
alter policy "insert own entries" on public.entries
  with check ((select auth.uid()) = user_id);
alter policy "update own entries" on public.entries
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "delete own entries" on public.entries
  using ((select auth.uid()) = user_id);
