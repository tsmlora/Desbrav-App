-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    rarity TEXT NOT NULL DEFAULT 'common',
    badge_url TEXT,
    date_earned TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_distance BIGINT DEFAULT 0,
    cities_visited TEXT[] DEFAULT '{}',
    routes_completed TEXT[] DEFAULT '{}',
    group_rides INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    consecutive_days INTEGER DEFAULT 0,
    last_ride_date DATE,
    speed_records JSONB DEFAULT '[]',
    achievements_earned TEXT[] DEFAULT '{}',
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievement notifications table
CREATE TABLE IF NOT EXISTS public.achievement_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_achievement_id ON public.achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_achievement_notifications_user_id ON public.achievement_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_achievement_notifications_read ON public.achievement_notifications(read);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON public.achievement_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.achievement_notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON public.achievement_notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create user progress when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_progress (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user progress
CREATE OR REPLACE TRIGGER on_auth_user_created_progress
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_progress();

-- Create function to update user level based on points
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = FLOOR(NEW.total_points / 1000) + 1;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update level when points change
CREATE OR REPLACE TRIGGER on_points_update_level
    BEFORE UPDATE OF total_points ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_user_level();

-- Create function to add achievement notification
CREATE OR REPLACE FUNCTION public.add_achievement_notification(
    p_user_id UUID,
    p_achievement_id TEXT,
    p_title TEXT,
    p_message TEXT
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.achievement_notifications (user_id, achievement_id, title, message)
    VALUES (p_user_id, p_achievement_id, p_title, p_message)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;