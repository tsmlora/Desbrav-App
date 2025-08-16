import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAchievementStore } from '@/store/achievementStore';
import { useAuthStore } from '@/store/authStore';
import { mockGuestAchievements } from '@/constants/mockData';
import Colors from '@/constants/colors';
import AchievementCard from '@/components/AchievementCard';
import LevelProgress from '@/components/LevelProgress';
import AchievementNotification from '@/components/AchievementNotification';
import { Achievement } from '@/types/achievements';

export default function AchievementsScreen() {
  const { 
    userAchievements, 
    notifications, 
    markNotificationRead,
    clearNotifications 
  } = useAchievementStore();
  const { isGuest } = useAuthStore();
  
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | 'category'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  // Use mock data for guest users
  const displayAchievements = isGuest 
    ? mockGuestAchievements.map(achievement => ({
        id: achievement.id,
        name: achievement.title,
        description: achievement.description,
        unlocked: achievement.earned,
        progress: achievement.progress,
        maxProgress: 100,
        points: achievement.earned ? 100 : 0,
        rarity: 'common' as const,
        category: 'exploration' as const,
        dateEarned: achievement.earnedDate,
        icon: achievement.icon
      }))
    : userAchievements;

  const unlockedAchievements = displayAchievements.filter(a => a.unlocked);
  const lockedAchievements = displayAchievements.filter(a => !a.unlocked);
  
  const categories = ['all', 'distance', 'speed', 'exploration', 'social', 'time'];
  
  const getFilteredAchievements = (): Achievement[] => {
    let filtered = displayAchievements;
    
    if (filter === 'unlocked') {
      filtered = unlockedAchievements;
    } else if (filter === 'locked') {
      filtered = lockedAchievements;
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(a => a.category === categoryFilter);
    }
    
    return filtered.sort((a, b) => {
      // Sort by unlocked status first, then by rarity
      if (a.unlocked !== b.unlocked) {
        return a.unlocked ? -1 : 1;
      }
      
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });
  };

  useEffect(() => {
    // Show notifications (only for real users)
    if (!isGuest) {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length > 0 && !currentNotification) {
        setCurrentNotification(unreadNotifications[0]);
      }
    }
  }, [notifications, isGuest]);

  const handleDismissNotification = () => {
    if (currentNotification) {
      markNotificationRead(currentNotification.id);
      setCurrentNotification(null);
      
      // Show next notification if any
      const remainingNotifications = notifications.filter(n => !n.read && n.id !== currentNotification.id);
      if (remainingNotifications.length > 0) {
        setTimeout(() => {
          setCurrentNotification(remainingNotifications[0]);
        }, 500);
      }
    }
  };

  const getCategoryDisplayName = (category: string): string => {
    const names: Record<string, string> = {
      all: 'Todas',
      distance: 'Distância',
      speed: 'Velocidade',
      exploration: 'Exploração',
      social: 'Social',
      time: 'Tempo'
    };
    return names[category] || category;
  };

  const filteredAchievements = getFilteredAchievements();

  return (
    <View style={styles.container}>
      {currentNotification && !isGuest && (
        <AchievementNotification
          notification={currentNotification}
          onDismiss={handleDismissNotification}
        />
      )}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LevelProgress />
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayAchievements.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{unlockedAchievements.length}</Text>
            <Text style={styles.statLabel}>Desbloqueadas</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{lockedAchievements.length}</Text>
            <Text style={styles.statLabel}>Bloqueadas</Text>
          </View>
        </View>
        
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {['all', 'unlocked', 'locked'].map((filterType) => (
                <TouchableOpacity
                  key={filterType}
                  style={[styles.filterButton, filter === filterType && styles.activeFilter]}
                  onPress={() => setFilter(filterType as any)}
                >
                  <Text style={[styles.filterText, filter === filterType && styles.activeFilterText]}>
                    {filterType === 'all' ? 'Todas' : filterType === 'unlocked' ? 'Desbloqueadas' : 'Bloqueadas'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, categoryFilter === category && styles.activeCategoryFilter]}
                  onPress={() => setCategoryFilter(category)}
                >
                  <Text style={[styles.categoryText, categoryFilter === category && styles.activeCategoryText]}>
                    {getCategoryDisplayName(category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        
        <View style={styles.achievementsList}>
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map(achievement => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
                showProgress={true}
                isGuest={isGuest}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isGuest 
                  ? 'Dados de exemplo no modo visitante'
                  : 'Nenhuma conquista encontrada para os filtros selecionados.'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  filterContainer: {
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.card,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  activeFilterText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.cardDark,
  },
  activeCategoryFilter: {
    backgroundColor: Colors.accent,
  },
  categoryText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  activeCategoryText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  achievementsList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});