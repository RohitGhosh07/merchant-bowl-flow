-- Create Registration Table with proper structure and constraints
create table if not exists public.registrations (
    id text primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    company_name text not null,
    team_number text not null,
    player1_name text not null,
    player2_name text not null,
    player3_name text not null,
    player1_mobile text,
    player2_mobile text,
    player3_mobile text,
    player1_email text check (player1_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    player2_email text check (player2_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    player3_email text check (player3_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    captain_name text not null,
    captain_phone text check (captain_phone ~ '^\d{10}$'),
    captain_email text check (captain_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    payment_status text not null default 'Pending' check (payment_status in ('Paid', 'Pending')),
    payment_method text check (payment_method in ('online', 'offline')),
    payment_reference text,
    payment_date timestamp with time zone,
    amount numeric(10,2),
    gst_number text,
    committee_member text,
    registration_status text not null default 'active' check (registration_status in ('active', 'cancelled')),
    contact_phone text not null check (contact_phone ~ '^\d{10}$'),
    contact_email text not null check (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    contact_address text not null,
    captain_designation text not null
);

-- Create indexes for common queries
create index if not exists registrations_id_idx on public.registrations (id);
create index if not exists registrations_company_name_idx on public.registrations (company_name);
create index if not exists registrations_payment_status_idx on public.registrations (payment_status);
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);

-- Enable Row Level Security
alter table public.registrations enable row level security;

-- Create policies for access control
create policy "Allow public read access"
on public.registrations for select
to public
using (true);

create policy "Allow authenticated insert"
on public.registrations for insert
to authenticated
with check (true);

create policy "Allow admin update"
on public.registrations for update
to authenticated
using (auth.role() = 'admin');

-- Create function to generate tracking ID
create or replace function generate_tracking_id()
returns text
language plpgsql
as $$
declare
    new_id text;
    done bool;
begin
    done := false;
    while not done loop
        -- Generate a 6-digit random number
        new_id := lpad(floor(random() * 1000000)::text, 6, '0');
        -- Check if it already exists
        done := not exists (select 1 from public.registrations where id = new_id);
    end loop;
    return new_id;
end;
$$;
