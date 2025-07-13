import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Award, AlertTriangle } from 'lucide-react-native';
import { Route } from '@/constants/routes';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface RouteCardProps {
  route: Route;
  completed?: boolean;
}

export default function RouteCard({ route, completed = false }: RouteCardProps) {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return '#10B981';
      case 'Moderado':
        return '#F59E0B';
      case 'Difícil':
        return '#EF4444';
      case 'Extremo':
        return '#7C3AED';
      default:
        return '#94A3B8';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/routes/${route.id}`)}
    >
      <Image source={{ uri: route.image }} style={styles.image} />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      
      {completed && (
        <View style={styles.completedBadge}>
          <Award size={16} color="#FFFFFF" />
          <Text style={styles.completedText}>Concluído</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.name}>{route.name}</Text>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.region}>{route.region}</Text>
          
          <View style={[
            styles.difficultyBadge, 
            { backgroundColor: getDifficultyColor(route.difficulty) }
          ]}>
            <Text style={styles.difficultyText}>{route.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {route.description}
        </Text>
        
        {route.dangers.length > 0 && (
          <View style={styles.dangerContainer}>
            <AlertTriangle size={16} color={Colors.accent} />
            <Text style={styles.dangerText}>
              {route.dangers.length} {route.dangers.length === 1 ? 'perigo' : 'perigos'} na rota
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
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  region: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  dangerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dangerText: {
    color: Colors.accent,
    fontSize: 13,
  },
});