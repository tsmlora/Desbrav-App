import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/appStore';
import { useAchievementStore } from '@/store/achievementStore';
import { useAchievementTracker } from '@/hooks/useAchievementTracker';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import Logo from '@/components/Logo';
import GPSStatusCard from '@/components/GPSStatusCard';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Trophy, Users, Navigation, MessageCircle, Locate, Plus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const { notifications } = useAchievementStore();
  const { forceCheckAchievements } = useAchievementTracker();
  const { isGuest } = useAuthStore();
  const [mapRegion, setMapRegion] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const unreadNotifications = isGuest ? 2 : notifications.filter(n => !n.read).length;
  const unreadMessages = isGuest ? 3 : 0; // Mock unread messages

  useEffect(() => {
    // Check for new achievements on app start (only for real users)
    if (!isGuest) {
      forceCheckAchievements();
    }
  }, [isGuest]);

  return (
    <View style={styles.container}>
      {/* Header with Logo and Messages Button */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Logo size="medium" />
          <TouchableOpacity 
            style={styles.messagesButton}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <MessageCircle size={24} color={Colors.text} />
            {unreadMessages > 0 && (
              <View style={styles.messageBadge}>
                <Text style={styles.messageBadgeText}>{unreadMessages}</Text>
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
              ? 'Explore rotas e pontos no mapa!' 
              : 'Descubra novas aventuras próximas a você'
            }
          </Text>
        </View>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Representational Map */}
        <View style={styles.mapPlaceholder}>
          <LinearGradient
            colors={['#4A90E2', '#7BB3F0', '#A8D0F8']}
            style={styles.mapGradient}
          >
            {/* Mock map elements */}
            <View style={styles.mapElements}>
              {/* Current location marker */}
              <View style={[styles.marker, styles.currentLocationMarker]}>
                <Locate size={16} color={Colors.textLight} />
              </View>
              
              {/* Route markers */}
              <View style={[styles.marker, styles.routeMarker, { top: '25%', left: '30%' }]}>
                <Navigation size={12} color={Colors.textLight} />
              </View>
              
              <View style={[styles.marker, styles.routeMarker, { top: '60%', right: '25%' }]}>
                <Navigation size={12} color={Colors.textLight} />
              </View>
              
              {/* Rest place markers */}
              <View style={[styles.marker, styles.restPlaceMarker, { top: '40%', left: '20%' }]}>
                <MapPin size={12} color={Colors.textLight} />
              </View>
              
              <View style={[styles.marker, styles.restPlaceMarker, { top: '70%', left: '60%' }]}>
                <MapPin size={12} color={Colors.textLight} />
              </View>
            </View>
            
            {/* Map overlay text */}
            <View style={styles.mapOverlay}>
              <Text style={styles.mapTitle}>Mapa Interativo</Text>
              <Text style={styles.mapSubtitle}>Toque para explorar rotas e pontos</Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => router.push('/gps-map')}
          >
            <Locate size={20} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => router.push('/search')}
          >
            <Plus size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* GPS Status Card */}
      <View style={styles.statusContainer}>
        <GPSStatusCard />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/rest-places')}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={styles.actionGradient}
          >
            <MapPin size={20} color={Colors.textLight} />
            <Text style={styles.actionText}>Pontos</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/community')}
        >
          <LinearGradient
            colors={[Colors.secondary, Colors.secondaryLight]}
            style={styles.actionGradient}
          >
            <Users size={20} color={Colors.textLight} />
            <Text style={styles.actionText}>Comunidade</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/achievements')}
        >
          <LinearGradient
            colors={[Colors.accent, Colors.primaryLight]}
            style={styles.actionGradient}
          >
            <Trophy size={20} color={Colors.textLight} />
            <Text style={styles.actionText}>Conquistas</Text>
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  messagesButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBadgeText: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: 'bold',
  },
  welcomeSection: {
    marginTop: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  mapPlaceholder: {
    flex: 1,
    minHeight: 300,
  },
  mapGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  currentLocationMarker: {
    backgroundColor: Colors.primary,
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
  },
  routeMarker: {
    backgroundColor: Colors.secondary,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  restPlaceMarker: {
    backgroundColor: Colors.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 20,
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
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    position: 'relative',
  },
  actionText: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: 'bold',
  },
});