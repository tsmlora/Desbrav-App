import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Medal } from '@/types';
import Colors from '@/constants/colors';
import { Calendar, MapPin } from 'lucide-react-native';
import { routes } from '@/constants/routes';
import { LinearGradient } from 'expo-linear-gradient';

interface MedalCardProps {
  medal: Medal;
  locked?: boolean;
}

export default function MedalCard({ medal, locked = false }: MedalCardProps) {
  const router = useRouter();
  const route = routes.find(r => r.id === medal.routeId);

  const handlePress = () => {
    if (!locked && route) {
      router.push(`/routes/${route.id}`);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, locked && styles.lockedContainer]}
      onPress={handlePress}
      disabled={locked}
    >
      <View style={styles.medalImageContainer}>
        <LinearGradient
          colors={locked ? ['#333', '#222'] : [Colors.primary, Colors.accent]}
          style={styles.medalGradient}
        />
        <Image 
          source={{ uri: medal.image }} 
          style={[styles.medalImage, locked && styles.lockedImage]} 
        />
        {locked && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockText}>BLOQUEADO</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, locked && styles.lockedText]}>
          {medal.name}
        </Text>
        
        <Text style={[styles.description, locked && styles.lockedText]} numberOfLines={2}>
          {medal.description}
        </Text>
        
        {!locked && medal.dateEarned && (
          <View style={styles.infoRow}>
            <Calendar size={14} color={Colors.primary} />
            <Text style={styles.dateText}>Conquistada em {medal.dateEarned}</Text>
          </View>
        )}
        
        {route && (
          <View style={styles.infoRow}>
            <MapPin size={14} color={locked ? Colors.textSecondary : Colors.primary} />
            <Text style={[styles.routeText, locked && styles.lockedText]}>
              {route.name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lockedContainer: {
    backgroundColor: Colors.cardDark,
    opacity: 0.8,
  },
  medalImageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
  },
  medalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  lockedImage: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: Colors.primary,
  },
  routeText: {
    fontSize: 12,
    color: Colors.primary,
  },
  lockedText: {
    color: Colors.textSecondary,
  },
});