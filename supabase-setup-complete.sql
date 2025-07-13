-- Complete Supabase Database Setup for Desbrav App
-- Execute these commands in your Supabase SQL Editor

-- 1. Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  region TEXT,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create community_members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- 5. Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  participant_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create event_participants table
CREATE TABLE IF NOT EXISTS public.event_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies

-- Users policies - Allow authenticated users to read all users, update their own profile
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Messages policies
DROP POLICY IF EXISTS "Users can manage messages" ON public.messages;
CREATE POLICY "Users can manage messages" ON public.messages
  FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = sender_id);

-- Communities policies
DROP POLICY IF EXISTS "Anyone can view communities" ON public.communities;
CREATE POLICY "Anyone can view communities" ON public.communities
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can create communities" ON public.communities;
CREATE POLICY "Authenticated users can create communities" ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can update communities" ON public.communities;
CREATE POLICY "Creators can update communities" ON public.communities
  FOR UPDATE USING (auth.uid() = creator_id);

-- Community members policies
DROP POLICY IF EXISTS "Anyone can view community members" ON public.community_members;
CREATE POLICY "Anyone can view community members" ON public.community_members
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can join communities" ON public.community_members;
CREATE POLICY "Users can join communities" ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave communities" ON public.community_members;
CREATE POLICY "Users can leave communities" ON public.community_members
  FOR DELETE USING (auth.uid() = user_id);

-- Events policies
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can update events" ON public.events;
CREATE POLICY "Creators can update events" ON public.events
  FOR UPDATE USING (auth.uid() = creator_id);

-- Event participants policies
DROP POLICY IF EXISTS "Anyone can view event participants" ON public.event_participants;
CREATE POLICY "Anyone can view event participants" ON public.event_participants
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can join events" ON public.event_participants;
CREATE POLICY "Users can join events" ON public.event_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave events" ON public.event_participants;
CREATE POLICY "Users can leave events" ON public.event_participants
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, onboarding_completed, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    FALSE,
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_communities_updated_at ON public.communities;
CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Create function to update community member count
CREATE OR REPLACE FUNCTION public.update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities 
    SET member_count = member_count + 1 
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities 
    SET member_count = member_count - 1 
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 14. Create triggers for community member count
DROP TRIGGER IF EXISTS update_community_member_count_insert ON public.community_members;
CREATE TRIGGER update_community_member_count_insert
  AFTER INSERT ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.update_community_member_count();

DROP TRIGGER IF EXISTS update_community_member_count_delete ON public.community_members;
CREATE TRIGGER update_community_member_count_delete
  AFTER DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.update_community_member_count();

-- 15. Create function to update event participant count
CREATE OR REPLACE FUNCTION public.update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events 
    SET participant_count = participant_count + 1 
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events 
    SET participant_count = participant_count - 1 
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 16. Create triggers for event participant count
DROP TRIGGER IF EXISTS update_event_participant_count_insert ON public.event_participants;
CREATE TRIGGER update_event_participant_count_insert
  AFTER INSERT ON public.event_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_event_participant_count();

DROP TRIGGER IF EXISTS update_event_participant_count_delete ON public.event_participants;
CREATE TRIGGER update_event_participant_count_delete
  AFTER DELETE ON public.event_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_event_participant_count();

-- 17. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_community ON public.events(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_event ON public.event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user ON public.event_participants(user_id);