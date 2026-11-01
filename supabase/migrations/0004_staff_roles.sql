-- Denormalize email onto profiles so an admin can look staff up by it —
-- auth.users isn't queryable through the anon/authenticated API.
alter table public.profiles add column email text;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, email) values (new.id, 'player', new.email);
  return new;
end $$;

update public.profiles p set email = u.email
  from auth.users u where p.id = u.id and p.email is null;

create function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- An admin can promote/demote anyone's role (self-registered staff default
-- to 'player' — this is the only way to grant coach/admin access afterward).
create policy "admin manages roles" on public.profiles for update
  using (public.is_admin())
  with check (true);
