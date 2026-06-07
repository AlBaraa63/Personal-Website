-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  resume_text text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

-- Applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company text not null,
  role text not null,
  status text not null default 'applied' check (
    status in ('wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected')
  ),
  url text, description text, notes text, salary_range text, location text,
  remote boolean not null default false,
  applied_at date, follow_up_at date,
  contact_name text, contact_email text, cover_letter text, ai_parsed jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.applications enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can manage own applications" on public.applications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger applications_updated_at before update on public.applications
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, plan) values (new.id, new.email, 'free') on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
