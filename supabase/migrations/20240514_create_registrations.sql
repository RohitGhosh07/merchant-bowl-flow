-- Create Registration Table
create table if not exists public.registrations (
    id text primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    company_name text not null,
    team_number text not null,
    player1_name text not null,
    player2_name text not null,
    captain_name text not null,
    captain_phone text,
    captain_email text,
    payment_status text default 'Pending' check (payment_status in ('Paid', 'Pending')),
    payment_method text check (payment_method in ('online', 'offline')),
    payment_reference text,
    payment_date timestamp with time zone,
    amount numeric(10,2),
    gst_number text,
    committee_member text,
    status text default 'active' check (status in ('active', 'cancelled')),
    contact_phone text,
    contact_email text
);

-- Add RLS Policies
alter table public.registrations enable row level security;

-- Allow read access to authenticated users
create policy "Allow read access to authenticated users"
on public.registrations
for select using (auth.role() = 'authenticated');

-- Allow insert access to anyone (for public registration)
create policy "Allow insert access to anyone"
on public.registrations
for insert with check (true);

-- Create index for faster tracking ID lookups
create index if not exists registrations_id_idx on public.registrations (id);

-- Add comments for better documentation
comment on table public.registrations is 'Stores all tournament team registrations';
comment on column public.registrations.id is 'Unique 6-digit tracking ID';
comment on column public.registrations.payment_status is 'Payment status (Paid/Pending)';
comment on column public.registrations.payment_method is 'Payment method (online/offline)';
comment on column public.registrations.status is 'Registration status (active/cancelled)';
