import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/appStore';
import { useAchievementStore } from '@/store/achievementStore';
import { useAchievementTracker } from '@/hooks/useAchievementTracker';
import { useAuthStore } from '@/store/authStore';
import { mockGuestRoutes, mockGuestAchievements } from '@/constants/mockData';
import Colors from '@/constants/colors';
import Logo from '@/components/Logo';
import RouteCard from '@/components/RouteCard';
import GPSStatusCard from '@/components/GPSStatusCard';
import LevelProgress from '@/components/LevelProgress';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Trophy, Users, Navigation, Bell } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { routes, user } = useAppStore();
  const { userAchievements, notifications } = useAchievementStore();
  const { forceCheckAchievements } = useAchievementTracker();
  const { isGuest } = useAuthStore();

  // Use mock data for guest users
  const displayRoutes = isGuest ? mockGuestRoutes : routes;
  const displayAchievements = isGuest ? mockGuestAchievements : userAchievements;
  
  const featuredRoutes = displayRoutes.slice(0, 3);
  const recentAchievements = isGuest 
    ? mockGuestAchievements.filter(a => a.earned).slice(0, 3)
    : displayAchievements
        .filter(a => a.unlocked)
        .sort((a, b) => new Date(b.dateEarned || '').getTime() - new Date(a.dateEarned || '').getTime())
        .slice(0, 3);

  const unreadNotifications = isGuest ? 2 : notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Check for new achievements on app start (only for real users)
    if (!isGuest) {
      forceCheckAchievements();
    }
  }, [isGuest]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Logo size="medium" />
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.text} />
            {unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>
            Olá, {user?.name || 'Motociclista'}!
            {isGuest && ' 👋'}
          </Text>
          <Text style={styles.subtitle}>
            {isGuest 
              ? 'Explore o app no modo visitante!' 
              : 'Pronto para sua próxima aventura?'
            }
          </Text>
        </View>
      </View>

      <LevelProgress />

      <GPSStatusCard />

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/gps-map')}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={styles.actionGradient}
          >
            <Navigation size={24} color={Colors.textLight} />
            <Text style={styles.actionText}>Rastrear GPS</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/achievements')}
        >
          <LinearGradient
            colors={[Colors.secondary, Colors.secondaryLight]}
            style={styles.actionGradient}
          >
            <Trophy size={24} color={Colors.textLight} />
            <Text style={styles.actionText}>Conquistas</Text>
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/community')}
        >
          <LinearGradient
            colors={[Colors.accent, Colors.primaryLight]}
            style={styles.actionGradient}
          >
            <Users size={24} color={Colors.textLight} />
            <Text style={styles.actionText}>Comunidade</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {recentAchievements.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/achievements')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsRow}>
              {recentAchievements.map(achievement => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <View style={styles.achievementIcon}>
                    {isGuest ? (
                      <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                    ) : (
                      <Trophy size={20} color={Colors.primary} />
                    )}
                  </View>
                  <Text style={styles.achievementName} numberOfLines={2}>
                    {isGuest ? achievement.title : achievement.name}
                  </Text>
                  <Text style={styles.achievementPoints}>
                    {isGuest ? '✓ Conquistado' : `+${achievement.points} pts`}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rotas em Destaque</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        
        {featuredRoutes.map(route => (
          <RouteCard key={route.id} route={route} isGuest={isGuest} />
        ))}
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => router.push('/(tabs)/rest-places')}
        >
          <View style={styles.exploreContent}>
            <MapPin size={24} color={Colors.primary} />
            <View style={styles.exploreTextContent}>
              <Text style={styles.exploreTitle}>Pontos de Apoio</Text>
              <Text style={styles.exploreSubtitle}>
                Encontre postos, oficinas e locais de descanso
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  welcomeSection: {
    marginTop: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    position: 'relative',
  },
  actionText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementPoints: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
  },
  achievementEmoji: {
    fontSize: 20,
  },
  exploreButton: {
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  exploreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  exploreTextContent: {
    marginLeft: 16,
    flex: 1,
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  exploreSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});