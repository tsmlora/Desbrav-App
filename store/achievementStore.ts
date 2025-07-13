import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, UserProgress, AchievementNotification, SpeedRecord } from '@/types/achievements';
import { achievements } from '@/constants/achievements';

interface AchievementStore {
  userProgress: UserProgress;
  userAchievements: Achievement[];
  notifications: AchievementNotification[];
  totalPoints: number;
  level: number;
  
  // Actions
  updateProgress: (updates: Partial<UserProgress>) => void;
  addDistance: (distance: number) => void;
  addCity: (cityName: string) => void;
  completeRoute: (routeId: string) => void;
  addGroupRide: () => void;
  addShare: () => void;
  addSpeedRecord: (record: SpeedRecord) => void;
  checkAchievements: () => Achievement[];
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  calculateLevel: () => number;
  getProgressForAchievement: (achievementId: string) => { current: number; max: number; percentage: number };
}

const initialProgress: UserProgress = {
  userId: '',
  total_distance: 0,
  cities_visited: [],
  routes_completed: [],
  group_rides: 0,
  shares_count: 0,
  consecutive_days: 0,
  last_ride_date: '',
  speed_records: [],
  achievements_earned: [],
};

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      userProgress: initialProgress,
      userAchievements: achievements.map(a => ({ ...a, unlocked: false })),
      notifications: [],
      totalPoints: 0,
      level: 1,

      updateProgress: (updates) => {
        set((state) => ({
          userProgress: { ...state.userProgress, ...updates }
        }));
        get().checkAchievements();
      },

      addDistance: (distance) => {
        const { userProgress } = get();
        const newTotalDistance = userProgress.total_distance + distance;
        
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            total_distance: newTotalDistance,
            last_ride_date: new Date().toISOString().split('T')[0],
          }
        }));
        
        get().checkAchievements();
      },

      addCity: (cityName) => {
        const { userProgress } = get();
        if (!userProgress.cities_visited.includes(cityName)) {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              cities_visited: [...state.userProgress.cities_visited, cityName]
            }
          }));
          get().checkAchievements();
        }
      },

      completeRoute: (routeId) => {
        const { userProgress } = get();
        if (!userProgress.routes_completed.includes(routeId)) {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              routes_completed: [...state.userProgress.routes_completed, routeId]
            }
          }));
          get().checkAchievements();
        }
      },

      addGroupRide: () => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            group_rides: state.userProgress.group_rides + 1
          }
        }));
        get().checkAchievements();
      },

      addShare: () => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            shares_count: state.userProgress.shares_count + 1
          }
        }));
        get().checkAchievements();
      },

      addSpeedRecord: (record) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            speed_records: [...state.userProgress.speed_records, record]
          }
        }));
        get().checkAchievements();
      },

      checkAchievements: () => {
        const { userProgress, userAchievements } = get();
        const newlyEarned: Achievement[] = [];
        
        const updatedAchievements = userAchievements.map(achievement => {
          if (achievement.unlocked || userProgress.achievements_earned.includes(achievement.id)) {
            return { ...achievement, unlocked: true };
          }

          const isEarned = checkAchievementCriteria(achievement, userProgress);
          
          if (isEarned) {
            newlyEarned.push(achievement);
            return { ...achievement, unlocked: true, dateEarned: new Date().toISOString().split('T')[0] };
          }

          return achievement;
        });

        if (newlyEarned.length > 0) {
          const newNotifications: AchievementNotification[] = newlyEarned.map(achievement => ({
            id: `notif-${achievement.id}-${Date.now()}`,
            achievementId: achievement.id,
            title: 'Nova Conquista!',
            message: `Você desbloqueou: ${achievement.name}`,
            timestamp: Date.now(),
            read: false,
          }));

          const newAchievementIds = newlyEarned.map(a => a.id);
          const newTotalPoints = get().totalPoints + newlyEarned.reduce((sum, a) => sum + a.points, 0);

          set((state) => ({
            userAchievements: updatedAchievements,
            notifications: [...state.notifications, ...newNotifications],
            userProgress: {
              ...state.userProgress,
              achievements_earned: [...state.userProgress.achievements_earned, ...newAchievementIds]
            },
            totalPoints: newTotalPoints,
            level: calculateLevelFromPoints(newTotalPoints),
          }));
        }

        return newlyEarned;
      },

      markNotificationRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      calculateLevel: () => {
        const { totalPoints } = get();
        return calculateLevelFromPoints(totalPoints);
      },

      getProgressForAchievement: (achievementId) => {
        const { userProgress } = get();
        const achievement = achievements.find(a => a.id === achievementId);
        
        if (!achievement) return { current: 0, max: 1, percentage: 0 };

        const { current, max } = getAchievementProgress(achievement, userProgress);
        const percentage = Math.min((current / max) * 100, 100);

        return { current, max, percentage };
      },
    }),
    {
      name: 'achievement-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper functions
function checkAchievementCriteria(achievement: Achievement, progress: UserProgress): boolean {
  const { criteria } = achievement;

  if (criteria.total_distance && progress.total_distance < criteria.total_distance) return false;
  if (criteria.cities_visited && progress.cities_visited.length < criteria.cities_visited) return false;
  if (criteria.routes_completed && progress.routes_completed.length < criteria.routes_completed) return false;
  if (criteria.group_rides && progress.group_rides < criteria.group_rides) return false;
  if (criteria.shares_count && progress.shares_count < criteria.shares_count) return false;
  if (criteria.consecutive_days && progress.consecutive_days < criteria.consecutive_days) return false;

  // Speed criteria check
  if (criteria.average_speed_min || criteria.average_speed_max || criteria.consistent_speed_duration) {
    const validRecords = progress.speed_records.filter(record => {
      if (criteria.average_speed_min && record.average_speed < criteria.average_speed_min) return false;
      if (criteria.average_speed_max && record.average_speed > criteria.average_speed_max) return false;
      if (criteria.consistent_speed_duration && record.duration < criteria.consistent_speed_duration) return false;
      return true;
    });
    
    if (validRecords.length === 0) return false;
  }

  return true;
}

function getAchievementProgress(achievement: Achievement, progress: UserProgress): { current: number; max: number } {
  const { criteria } = achievement;

  if (criteria.total_distance) {
    return { current: progress.total_distance, max: criteria.total_distance };
  }
  if (criteria.cities_visited) {
    return { current: progress.cities_visited.length, max: criteria.cities_visited };
  }
  if (criteria.routes_completed) {
    return { current: progress.routes_completed.length, max: criteria.routes_completed };
  }
  if (criteria.group_rides) {
    return { current: progress.group_rides, max: criteria.group_rides };
  }
  if (criteria.shares_count) {
    return { current: progress.shares_count, max: criteria.shares_count };
  }
  if (criteria.consecutive_days) {
    return { current: progress.consecutive_days, max: criteria.consecutive_days };
  }

  return { current: 0, max: 1 };
}

function calculateLevelFromPoints(points: number): number {
  // Level calculation: every 1000 points = 1 level
  return Math.floor(points / 1000) + 1;
}