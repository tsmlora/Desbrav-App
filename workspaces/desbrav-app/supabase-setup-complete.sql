-- Profiles Schema
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  bio TEXT,
  motorcycle TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Communities Schema
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security for communities
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view communities" ON communities
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create communities" ON communities
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  community_id UUID REFERENCES communities(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security for community_members
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can join communities" ON community_members
  FOR INSERT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can see members of communities they are in" ON community_members
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM community_members WHERE community_id = community_members.community_id
    )
  );

-- Events Schema
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  community_id UUID REFERENCES communities(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON events
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create events" ON events
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Messages Schema
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id),
  receiver_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Row-Level Security for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can see their messages" ON messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can update read status of received messages" ON messages
  FOR UPDATE
  USING (auth.uid() = receiver_id);

-- GPS Tracking Schema
CREATE TABLE IF NOT EXISTS gps_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  start_location GEOGRAPHY,
  end_location GEOGRAPHY,
  distance FLOAT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security for gps_routes
ALTER TABLE gps_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own routes" ON gps_routes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create routes" ON gps_routes
  FOR INSERT
  USING (auth.uid() = user_id);

-- Achievements Schema
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  target_value FLOAT NOT NULL,
  badge_url TEXT,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security for achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS achievement_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  achievement_id UUID REFERENCES achievements(id),
  progress FLOAT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security for achievement_progress
ALTER TABLE achievement_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own progress" ON achievement_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their progress" ON achievement_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their progress" ON achievement_progress
  FOR INSERT
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS achievement_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  achievement_id UUID REFERENCES achievements(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security for achievement_notifications
ALTER TABLE achievement_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own notifications" ON achievement_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON achievement_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON achievement_notifications
  FOR INSERT
  USING (true);
