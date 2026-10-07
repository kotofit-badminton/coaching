create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'player' check (role in ('player','coach','admin')),
  player_id text,
  created_at timestamptz default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role) values (new.id, 'player');
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create table public.players (
  id text primary key,
  is_mock boolean not null default false,
  data jsonb not null
);

create table public.records (
  id text primary key,
  player_id text not null references public.players(id) on delete cascade,
  kind text not null check (kind in ('journey','note','match','clip','onboarding')),
  data jsonb not null
);

alter table public.profiles enable row level security;
alter table public.players enable row level security;
alter table public.records enable row level security;

create function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('coach','admin'));
$$;

create policy "own profile or staff" on public.profiles for select
  using (id = auth.uid() or public.is_staff());

create policy "read players" on public.players for select
  using (is_mock or public.is_staff() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.player_id = players.id));
create policy "staff write players" on public.players for all
  using (public.is_staff()) with check (public.is_staff());

create policy "read records" on public.records for select
  using (exists (select 1 from public.players pl where pl.id = records.player_id
           and (pl.is_mock or public.is_staff() or exists (
             select 1 from public.profiles p where p.id = auth.uid() and p.player_id = pl.id))));
create policy "staff write records" on public.records for all
  using (public.is_staff()) with check (public.is_staff());
create policy "player adds own notes" on public.records for insert
  with check (kind in ('note','match','clip') and exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.player_id = records.player_id));
