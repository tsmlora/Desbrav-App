import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/appStore';
import Colors from '@/constants/colors';
import RestPlaceCard from '@/components/RestPlaceCard';
import { Search, Plus } from 'lucide-react-native';
import { RestPlace } from '@/constants/restPlaces';

export default function RestPlacesScreen() {
  const router = useRouter();
  const { restPlaces } = useAppStore();
  const [filter, setFilter] = useState<string | null>(null);
  
  const placeTypes = Array.from(new Set(restPlaces.map(place => place.type)));
  
  const filteredPlaces = filter 
    ? restPlaces.filter(place => place.type === filter)
    : restPlaces;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => router.push('/search')}
      >
        <Search size={20} color={Colors.textSecondary} />
        <Text style={styles.searchPlaceholder}>Buscar locais de descanso...</Text>
      </TouchableOpacity>
      
      <View style={styles.filtersSection}>
        <Text style={styles.filtersTitle}>Filtrar por tipo</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, filter === null && styles.activeFilterChip]}
            onPress={() => setFilter(null)}
          >
            <Text style={[styles.filterChipText, filter === null && styles.activeFilterChipText]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          {placeTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterChip, filter === type && styles.activeFilterChip]}
              onPress={() => setFilter(type)}
            >
              <Text style={[styles.filterChipText, filter === type && styles.activeFilterChipText]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.placesContainer} showsVerticalScrollIndicator={false}>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <RestPlaceCard key={place.id} place={place} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum local de descanso encontrado com os filtros atuais.
            </Text>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity style={styles.suggestButton}>
        <Plus size={20} color={Colors.background} />
        <Text style={styles.suggestButtonText}>Sugerir Novo Local</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchPlaceholder: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  filtersSection: {
    marginBottom: 20,
  },
  filtersTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filtersContainer: {
    marginBottom: 4,
  },
  filtersContent: {
    paddingRight: 16,
    gap: 12,
  },
  filterChip: {
    backgroundColor: Colors.card,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: Colors.background,
    fontWeight: '600',
  },
  placesContainer: {
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
  suggestButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  suggestButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});