-- Run once in the Supabase SQL editor. The service-role key must stay server-side.
create extension if not exists pgcrypto;

create table if not exists public.estimate_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  service text not null,
  details text not null,
  contact_method text not null,
  partner_name text,
  photo_path text,
  source_path text,
  language text not null default 'en',
  notification_status text not null default 'pending' check (notification_status in ('pending', 'sent', 'failed'))
);

create table if not exists public.estimate_rate_limits (
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists estimate_rate_limits_lookup on public.estimate_rate_limits (ip_hash, created_at desc);

alter table public.estimate_requests enable row level security;
alter table public.estimate_rate_limits enable row level security;
revoke all on public.estimate_requests from anon, authenticated;
revoke all on public.estimate_rate_limits from anon, authenticated;

create or replace function public.consume_estimate_rate_limit(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  request_count integer;
begin
  if length(p_ip_hash) <> 64 then return false; end if;
  perform pg_advisory_xact_lock(hashtext(p_ip_hash));
  delete from public.estimate_rate_limits where ip_hash = p_ip_hash and created_at < now() - interval '24 hours';
  select count(*) into request_count from public.estimate_rate_limits
    where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
  if request_count >= 3 then return false; end if;
  insert into public.estimate_rate_limits (ip_hash) values (p_ip_hash);
  return true;
end;
$$;
revoke all on function public.consume_estimate_rate_limit(text) from public, anon, authenticated;
grant execute on function public.consume_estimate_rate_limit(text) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('estimate-photos', 'estimate-photos', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;