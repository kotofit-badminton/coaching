-- Supabase's sign-up flow runs as the supabase_auth_admin role, which by
-- default can't fire a trigger that writes to a public-schema table. Without
-- these grants, auth.signUp() fails with "Database error saving new user".
grant usage on schema public to supabase_auth_admin;
grant all on public.profiles to supabase_auth_admin;
grant execute on function public.handle_new_user() to supabase_auth_admin;
