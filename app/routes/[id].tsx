import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, AlertTriangle, Award, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { routes, user } = useAppStore();
  
  const route = routes.find(r => r.id === id);
  
  if (!route) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Rota não encontrada</Text>
      </View>
    );
  }
  
  const isCompleted = user?.completedRoutes.includes(route.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: route.image }} style={styles.image} />
      
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Award size={16} color="#FFFFFF" />
          <Text style={styles.completedText}>Rota Concluída</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.name}>{route.name}</Text>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.region}>{route.region}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distância</Text>
            <Text style={styles.detailValue}>{route.distance}</Text>
          </View>
          
          <View style={styles.detailDivider} />
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Dificuldade</Text>
            <Text style={[
              styles.detailValue, 
              { color: getDifficultyColor(route.difficulty) }
            ]}>
              {route.difficulty}
            </Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Sobre a Rota</Text>
        <Text style={styles.description}>{route.description}</Text>
        
        <Text style={styles.sectionTitle}>Perigos e Alertas</Text>
        {route.dangers.length > 0 ? (
          route.dangers.map((danger, index) => (
            <View key={index} style={styles.dangerItem}>
              <AlertTriangle size={16} color={Colors.accent} />
              <Text style={styles.dangerText}>{danger}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDangersText}>Nenhum perigo reportado para esta rota.</Text>
        )}
        
        <Text style={styles.sectionTitle}>Medalha</Text>
        <View style={styles.medalContainer}>
          <Image source={{ uri: route.medal.image }} style={styles.medalImage} />
          <View style={styles.medalInfo}>
            <Text style={styles.medalName}>{route.medal.name}</Text>
            <Text style={styles.medalDescription}>{route.medal.description}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {isCompleted ? 'Refazer Rota' : 'Iniciar Rota'}
          </Text>
          <ArrowRight size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.accent,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  completedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  region: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  dangerText: {
    color: Colors.accent,
    fontSize: 14,
    flex: 1,
  },
  noDangersText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  medalContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  medalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  medalInfo: {
    marginLeft: 16,
    flex: 1,
  },
  medalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  medalDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  startButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  startButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});