import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '@/store/appStore';
import Colors from '@/constants/colors';
import MedalCard from '@/components/MedalCard';
import { Medal } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

export default function MedalsScreen() {
  const { medals, user } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const earnedMedals = medals.filter(medal => 
    user?.medals.some(userMedal => userMedal.id === medal.id || userMedal.routeId === medal.routeId)
  );
  
  const lockedMedals = medals.filter(medal => 
    !user?.medals.some(userMedal => userMedal.id === medal.id || userMedal.routeId === medal.routeId)
  );

  const filteredMedals = filter === 'all' 
    ? medals 
    : filter === 'earned' 
      ? earnedMedals 
      : lockedMedals;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsContainer}
      >
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{medals.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{earnedMedals.length}</Text>
          <Text style={styles.statLabel}>Conquistadas</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{lockedMedals.length}</Text>
          <Text style={styles.statLabel}>Bloqueadas</Text>
        </View>
      </LinearGradient>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'earned' && styles.activeFilter]}
          onPress={() => setFilter('earned')}
        >
          <Text style={[styles.filterText, filter === 'earned' && styles.activeFilterText]}>
            Conquistadas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'locked' && styles.activeFilter]}
          onPress={() => setFilter('locked')}
        >
          <Text style={[styles.filterText, filter === 'locked' && styles.activeFilterText]}>
            Bloqueadas
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.medalsList} showsVerticalScrollIndicator={false}>
        {filteredMedals.length > 0 ? (
          filteredMedals.map(medal => {
            const isLocked = !user?.medals.some(
              userMedal => userMedal.id === medal.id || userMedal.routeId === medal.routeId
            );
            
            return (
              <MedalCard 
                key={medal.id} 
                medal={medal} 
                locked={isLocked}
              />
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filter === 'earned' 
                ? 'Você ainda não conquistou nenhuma medalha.' 
                : 'Não há medalhas para mostrar.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
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
    color: Colors.text,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  medalsList: {
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