-- Coach-managed classes. Not player-scoped: any signed-in staff member can
-- read the roster/schedule, only coach/admin can create or edit classes.
create table public.classes (
  id text primary key,
  data jsonb not null
);

alter table public.classes enable row level security;

create policy "staff read classes" on public.classes for select
  using (public.is_staff());
create policy "staff write classes" on public.classes for all
  using (public.is_staff()) with check (public.is_staff());

-- A parent can create exactly one player (their own child) during sign-up,
-- as long as their profile doesn't already have a player attached.
create policy "parent creates own player" on public.players for insert
  with check (
    not is_mock
    and not exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.player_id is not null
    )
  );

-- A profile's player_id can only be set once, by its own owner, from null.
create policy "parent attaches own player once" on public.profiles for update
  using (id = auth.uid() and player_id is null)
  with check (id = auth.uid());

-- Sign-up also needs to write the initial onboarding evaluation and journey
-- for the player just created, not just notes/matches/clips.
drop policy "player adds own notes" on public.records;
create policy "player adds own records" on public.records for insert
  with check (
    kind in ('note', 'match', 'clip', 'onboarding', 'journey')
    and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.player_id = records.player_id
    )
  );
