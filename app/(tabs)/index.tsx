import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/appStore';
import { useAchievementStore } from '@/store/achievementStore';
import { useAchievementTracker } from '@/hooks/useAchievementTracker';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Navigation, MessageCircle, Locate, Plus, Menu, Search, Layers } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const { notifications } = useAchievementStore();
  const { forceCheckAchievements } = useAchievementTracker();
  const { isGuest } = useAuthStore();
  const insets = useSafeAreaInsets();
  
  // Brazil map region
  const [mapRegion, setMapRegion] = useState({
    latitude: -14.2350,  // Center of Brazil
    longitude: -51.9253,
    latitudeDelta: 30.0,  // Wide view to show all of Brazil
    longitudeDelta: 30.0,
  });

  const unreadMessages = isGuest ? 3 : 0;

  useEffect(() => {
    if (!isGuest) {
      forceCheckAchievements();
    }
  }, [isGuest]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Full Screen Map */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={['#0066cc', '#0080ff', '#4da6ff', '#80bfff']}
          style={styles.mapGradient}
          locations={[0, 0.3, 0.7, 1]}
        >
          {/* Brazil territory representation */}
          <View style={styles.brazilOutline}>
            {/* Brazil mainland territory */}
            <View style={styles.brazilTerritory} />
            
            {/* Amazon region */}
            <View style={styles.amazonRegion} />
            
            {/* Northeast region */}
            <View style={styles.northeastRegion} />
            
            {/* Southeast region */}
            <View style={styles.southeastRegion} />
            
            {/* South region */}
            <View style={styles.southRegion} />
            
            {/* Central-West region */}
            <View style={styles.centralWestRegion} />
            {/* Major cities markers */}
            <View style={[styles.cityMarker, { top: '25%', left: '45%' }]}>
              <View style={styles.cityDot} />
              <Text style={styles.cityLabel}>Brasília</Text>
            </View>
            
            <View style={[styles.cityMarker, { top: '35%', left: '55%' }]}>
              <View style={styles.cityDot} />
              <Text style={styles.cityLabel}>São Paulo</Text>
            </View>
            
            <View style={[styles.cityMarker, { top: '40%', left: '60%' }]}>
              <View style={styles.cityDot} />
              <Text style={styles.cityLabel}>Rio de Janeiro</Text>
            </View>
            
            <View style={[styles.cityMarker, { top: '15%', left: '40%' }]}>
              <View style={styles.cityDot} />
              <Text style={styles.cityLabel}>Manaus</Text>
            </View>
            
            <View style={[styles.cityMarker, { top: '20%', left: '65%' }]}>
              <View style={styles.cityDot} />
              <Text style={styles.cityLabel}>Fortaleza</Text>
            </View>
            
            <View style={[styles.cityMarker, { top: '25%', left: '70%' }]}>
              <View style={styles.cityDot} />
              <Text style={styles.cityLabel}>Salvador</Text>
            </View>
            
            {/* Route lines connecting cities */}
            <View style={[styles.routeLine, { top: '25%', left: '45%', width: 80, transform: [{ rotate: '25deg' }] }]} />
            <View style={[styles.routeLine, { top: '35%', left: '55%', width: 60, transform: [{ rotate: '15deg' }] }]} />
            <View style={[styles.routeLine, { top: '20%', left: '50%', width: 100, transform: [{ rotate: '-30deg' }] }]} />
            
            {/* Motorcycle route markers */}
            <View style={[styles.routeMarker, { top: '30%', left: '50%' }]}>
              <Navigation size={14} color={Colors.textLight} />
            </View>
            
            <View style={[styles.routeMarker, { top: '45%', left: '40%' }]}>
              <Navigation size={14} color={Colors.textLight} />
            </View>
            
            <View style={[styles.routeMarker, { top: '35%', left: '65%' }]}>
              <Navigation size={14} color={Colors.textLight} />
            </View>
            
            {/* Rest places */}
            <View style={[styles.restPlaceMarker, { top: '28%', left: '48%' }]}>
              <MapPin size={12} color={Colors.textLight} />
            </View>
            
            <View style={[styles.restPlaceMarker, { top: '42%', left: '58%' }]}>
              <MapPin size={12} color={Colors.textLight} />
            </View>
            
            <View style={[styles.restPlaceMarker, { top: '22%', left: '42%' }]}>
              <MapPin size={12} color={Colors.textLight} />
            </View>
            
            {/* Current location (pulsing) */}
            <View style={[styles.currentLocationMarker, { top: '35%', left: '55%' }]}>
              <View style={styles.currentLocationPulse} />
              <View style={styles.currentLocationDot}>
                <Locate size={12} color={Colors.textLight} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
      
      {/* Top Header Overlay */}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Menu size={24} color={Colors.textLight} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Desbrav</Text>
          <Text style={styles.headerSubtitle}>Explore o Brasil</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.messagesButton}
          onPress={() => router.push('/chat/1')}
        >
          <MessageCircle size={24} color={Colors.textLight} />
          {unreadMessages > 0 && (
            <View style={styles.messageBadge}>
              <Text style={styles.messageBadgeText}>{unreadMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
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
          <Search size={20} color={Colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapControlButton}
          onPress={() => {}}
        >
          <Layers size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Bottom Info Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.panelHandle} />
        <View style={styles.panelContent}>
          <Text style={styles.panelTitle}>Rotas Próximas</Text>
          <Text style={styles.panelSubtitle}>Descubra aventuras incríveis</Text>
          
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Rotas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>43</Text>
              <Text style={styles.statLabel}>Pontos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.1k</Text>
              <Text style={styles.statLabel}>Motociclistas</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3c72',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapGradient: {
    flex: 1,
    position: 'relative',
  },
  brazilTerritory: {
    position: 'absolute',
    top: '15%',
    left: '25%',
    width: '50%',
    height: '65%',
    backgroundColor: '#2d5016',
    borderRadius: 20,
    transform: [{ rotate: '-5deg' }],
    opacity: 0.9,
  },
  amazonRegion: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    width: '45%',
    height: '35%',
    backgroundColor: '#1a4d0a',
    borderRadius: 25,
    transform: [{ rotate: '-8deg' }],
    opacity: 0.8,
  },
  northeastRegion: {
    position: 'absolute',
    top: '20%',
    left: '55%',
    width: '25%',
    height: '30%',
    backgroundColor: '#8b4513',
    borderRadius: 15,
    transform: [{ rotate: '10deg' }],
    opacity: 0.7,
  },
  southeastRegion: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    width: '30%',
    height: '25%',
    backgroundColor: '#228b22',
    borderRadius: 18,
    transform: [{ rotate: '-3deg' }],
    opacity: 0.8,
  },
  southRegion: {
    position: 'absolute',
    top: '65%',
    left: '40%',
    width: '25%',
    height: '20%',
    backgroundColor: '#32cd32',
    borderRadius: 12,
    transform: [{ rotate: '5deg' }],
    opacity: 0.7,
  },
  centralWestRegion: {
    position: 'absolute',
    top: '35%',
    left: '30%',
    width: '25%',
    height: '30%',
    backgroundColor: '#6b8e23',
    borderRadius: 20,
    transform: [{ rotate: '-10deg' }],
    opacity: 0.6,
  },
  brazilOutline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cityMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  cityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textLight,
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cityLabel: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  routeLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
  },
  routeMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  restPlaceMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  currentLocationMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    opacity: 0.7,
  },
  currentLocationDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  messagesButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  messageBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.textLight,
  },
  messageBadgeText: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: 'bold',
  },
  mapControls: {
    position: 'absolute',
    top: 120,
    right: 20,
    gap: 12,
    zIndex: 10,
  },
  mapControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backdropFilter: 'blur(10px)',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  panelContent: {
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  panelSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});