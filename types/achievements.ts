export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'distance' | 'speed' | 'exploration' | 'social' | 'route' | 'time';
  criteria: AchievementCriteria;
  badge_url: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  dateEarned?: string;
}

export interface AchievementCriteria {
  total_distance?: number; // in meters
  single_trip_distance?: number; // in meters
  cities_visited?: number;
  routes_completed?: number;
  average_speed_min?: number; // km/h
  average_speed_max?: number; // km/h
  consistent_speed_duration?: number; // minutes
  group_rides?: number;
  shares_count?: number;
  consecutive_days?: number;
  specific_route_id?: string;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night';
  weather_condition?: 'rain' | 'sun' | 'fog';
}

export interface UserProgress {
  userId: string;
  total_distance: number;
  cities_visited: string[];
  routes_completed: string[];
  group_rides: number;
  shares_count: number;
  consecutive_days: number;
  last_ride_date: string;
  speed_records: SpeedRecord[];
  achievements_earned: string[];
}

export interface SpeedRecord {
  date: string;
  average_speed: number;
  max_speed: number;
  duration: number;
  consistency_score: number;
}

export interface AchievementNotification {
  id: string;
  achievementId: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}