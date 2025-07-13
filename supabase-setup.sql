-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users table
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  avatar_url text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) on delete cascade not null,
  receiver_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read boolean default false
);

-- Create communities table
create table if not exists public.communities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  region text not null default 'Brasil',
  image_url text,
  creator_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create events table
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  location text not null,
  image_url text,
  creator_id uuid references public.users(id) on delete cascade not null,
  community_id uuid references public.communities(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create GPS coordinates table
create table if not exists public.gps_coordinates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  latitude double precision not null,
  longitude double precision not null,
  altitude double precision,
  accuracy double precision,
  speed double precision,
  heading double precision,
  timestamp bigint not null,
  synced boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create community members table
create table if not exists public.community_members (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  role text default 'member' check (role in ('admin', 'moderator', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(community_id, user_id)
);

-- Create event participants table
create table if not exists public.event_participants (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id)
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.messages enable row level security;
alter table public.communities enable row level security;
alter table public.events enable row level security;
alter table public.gps_coordinates enable row level security;
alter table public.community_members enable row level security;
alter table public.event_participants enable row level security;

-- Create policies for users table
create policy "Users can view all profiles" on public.users
  for select using (true);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Create policies for messages table
create policy "Users can view own messages" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages" on public.messages
  for insert with check (auth.uid() = sender_id);

create policy "Users can update own messages" on public.messages
  for update using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Create policies for communities table
create policy "Anyone can view communities" on public.communities
  for select using (true);

create policy "Authenticated users can create communities" on public.communities
  for insert with check (auth.role() = 'authenticated');

create policy "Community creators can update their communities" on public.communities
  for update using (auth.uid() = creator_id);

create policy "Community creators can delete their communities" on public.communities
  for delete using (auth.uid() = creator_id);

-- Create policies for events table
create policy "Anyone can view events" on public.events
  for select using (true);

create policy "Authenticated users can create events" on public.events
  for insert with check (auth.role() = 'authenticated');

create policy "Event creators can update their events" on public.events
  for update using (auth.uid() = creator_id);

create policy "Event creators can delete their events" on public.events
  for delete using (auth.uid() = creator_id);

-- Create policies for GPS coordinates table
create policy "Users can view own GPS coordinates" on public.gps_coordinates
  for select using (auth.uid() = user_id);

create policy "Users can insert own GPS coordinates" on public.gps_coordinates
  for insert with check (auth.uid() = user_id);

create policy "Users can update own GPS coordinates" on public.gps_coordinates
  for update using (auth.uid() = user_id);

create policy "Users can delete own GPS coordinates" on public.gps_coordinates
  for delete using (auth.uid() = user_id);

-- Create policies for community members table
create policy "Anyone can view community members" on public.community_members
  for select using (true);

create policy "Users can join communities" on public.community_members
  for insert with check (auth.uid() = user_id);

create policy "Users can leave communities" on public.community_members
  for delete using (auth.uid() = user_id);

-- Create policies for event participants table
create policy "Anyone can view event participants" on public.event_participants
  for select using (true);

create policy "Users can join events" on public.event_participants
  for insert with check (auth.uid() = user_id);

create policy "Users can leave events" on public.event_participants
  for delete using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_messages_sender_id on public.messages(sender_id);
create index if not exists idx_messages_receiver_id on public.messages(receiver_id);
create index if not exists idx_messages_created_at on public.messages(created_at desc);
create index if not exists idx_gps_coordinates_user_id on public.gps_coordinates(user_id);
create index if not exists idx_gps_coordinates_timestamp on public.gps_coordinates(timestamp desc);
create index if not exists idx_community_members_community_id on public.community_members(community_id);
create index if not exists idx_community_members_user_id on public.community_members(user_id);
create index if not exists idx_event_participants_event_id on public.event_participants(event_id);
create index if not exists idx_event_participants_user_id on public.event_participants(user_id);

-- Create functions for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger handle_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger handle_communities_updated_at
  before update on public.communities
  for each row execute function public.handle_updated_at();

create trigger handle_events_updated_at
  before update on public.events
  for each row execute function public.handle_updated_at();