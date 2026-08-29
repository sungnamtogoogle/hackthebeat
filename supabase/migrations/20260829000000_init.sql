create table if not exists public.party_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 2),
  graduation_year integer not null check (graduation_year between 1950 and 2035),
  party_mood text,
  created_at timestamptz not null default now()
);

create index if not exists party_registrations_created_at_idx
  on public.party_registrations (created_at desc);

alter table public.party_registrations enable row level security;
