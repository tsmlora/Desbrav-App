import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, User, MessageCircle, MapPin, Navigation, Clock, Star } from 'lucide-react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

// Mock users data
const mockUsers = [
  {
    id: '2',
    name: 'Maria Santos',
    username: 'maria_santos',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Motociclista apaixonada por aventuras'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    username: 'carlos_oliveira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Explorador de estradas'
  },
  {
    id: '4',
    name: 'Ana Silva',
    username: 'ana_silva',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Amante da velocidade'
  },
  {
    id: '5',
    name: 'Pedro Costa',
    username: 'pedro_costa',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Motociclista de fim de semana'
  }
];

// Mock destinations data
const mockDestinations = [
  {
    id: '1',
    name: 'Chapada dos Veadeiros',
    state: 'Goiás',
    distance: '245 km',
    duration: '3h 20min',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    type: 'Parque Nacional',
    difficulty: 'Médio'
  },
  {
    id: '2',
    name: 'Serra da Canastra',
    state: 'Minas Gerais',
    distance: '320 km',
    duration: '4h 15min',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    type: 'Parque Nacional',
    difficulty: 'Difícil'
  },
  {
    id: '3',
    name: 'Bonito',
    state: 'Mato Grosso do Sul',
    distance: '420 km',
    duration: '5h 30min',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    type: 'Ecoturismo',
    difficulty: 'Fácil'
  },
  {
    id: '4',
    name: 'Campos do Jordão',
    state: 'São Paulo',
    distance: '180 km',
    duration: '2h 45min',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    type: 'Cidade Turística',
    difficulty: 'Fácil'
  },
  {
    id: '5',
    name: 'Lençóis Maranhenses',
    state: 'Maranhão',
    distance: '1200 km',
    duration: '14h 30min',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    type: 'Parque Nacional',
    difficulty: 'Extremo'
  },
  {
    id: '6',
    name: 'Fernando de Noronha',
    state: 'Pernambuco',
    distance: '850 km',
    duration: '10h 15min',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    type: 'Ilha',
    difficulty: 'Médio'
  }
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [destinationResults, setDestinationResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'destinations' | 'users'>('destinations');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setIsSearching(true);
      // Simulate search
      setTimeout(() => {
        if (activeTab === 'destinations') {
          const results = mockDestinations.filter(destination => 
            destination.name.toLowerCase().includes(query.toLowerCase()) ||
            destination.state.toLowerCase().includes(query.toLowerCase()) ||
            destination.type.toLowerCase().includes(query.toLowerCase())
          );
          setDestinationResults(results);
        } else {
          const results = mockUsers.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(results);
        }
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setDestinationResults([]);
      setIsSearching(false);
    }
  };

  const handleStartChat = (selectedUser: any) => {
    router.push(`/chat/${selectedUser.id}`);
  };

  const handleSelectDestination = (destination: any) => {
    // Navigate back to map with selected destination
    router.back();
    // In a real app, you would pass the destination data back to the map
    console.log('Selected destination:', destination);
  };

  const handleTabChange = (tab: 'destinations' | 'users') => {
    setActiveTab(tab);
    setSearchQuery('');
    setSearchResults([]);
    setDestinationResults([]);
    setIsSearching(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Buscar',
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'destinations' && styles.activeTab]}
          onPress={() => handleTabChange('destinations')}
        >
          <MapPin size={18} color={activeTab === 'destinations' ? Colors.textLight : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'destinations' && styles.activeTabText]}>Destinos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => handleTabChange('users')}
        >
          <User size={18} color={activeTab === 'users' ? Colors.textLight : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Usuários</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={activeTab === 'destinations' ? 'Buscar destinos...' : 'Buscar usuários...'}
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {isSearching && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Buscando...</Text>
          </View>
        )}

        {!isSearching && searchQuery.length >= 2 && 
         ((activeTab === 'destinations' && destinationResults.length === 0) || 
          (activeTab === 'users' && searchResults.length === 0)) && (
          <View style={styles.emptyContainer}>
            {activeTab === 'destinations' ? 
              <MapPin size={48} color={Colors.textSecondary} /> : 
              <User size={48} color={Colors.textSecondary} />
            }
            <Text style={styles.emptyText}>
              {activeTab === 'destinations' ? 'Nenhum destino encontrado' : 'Nenhum usuário encontrado'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'destinations' ? 
                'Tente buscar por nome, estado ou tipo de destino' : 
                'Tente buscar por nome ou nome de usuário'
              }
            </Text>
          </View>
        )}

        {/* Destination Results */}
        {activeTab === 'destinations' && destinationResults.map((destination) => (
          <TouchableOpacity 
            key={destination.id} 
            style={styles.destinationItem}
            onPress={() => handleSelectDestination(destination)}
          >
            <Image 
              source={{ uri: destination.image }} 
              style={styles.destinationImage} 
            />
            <View style={styles.destinationInfo}>
              <View style={styles.destinationHeader}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={14} color={Colors.accent} fill={Colors.accent} />
                  <Text style={styles.rating}>{destination.rating}</Text>
                </View>
              </View>
              <Text style={styles.destinationState}>{destination.state}</Text>
              <Text style={styles.destinationType}>{destination.type} • {destination.difficulty}</Text>
              <View style={styles.destinationStats}>
                <View style={styles.statContainer}>
                  <Navigation size={12} color={Colors.textSecondary} />
                  <Text style={styles.statText}>{destination.distance}</Text>
                </View>
                <View style={styles.statContainer}>
                  <Clock size={12} color={Colors.textSecondary} />
                  <Text style={styles.statText}>{destination.duration}</Text>
                </View>
              </View>
            </View>
            <MapPin size={20} color={Colors.primary} />
          </TouchableOpacity>
        ))}
        
        {/* User Results */}
        {activeTab === 'users' && searchResults.map((user) => (
          <TouchableOpacity 
            key={user.id} 
            style={styles.userItem}
            onPress={() => handleStartChat(user)}
          >
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.userAvatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userUsername}>@{user.username}</Text>
              {user.bio && (
                <Text style={styles.userBio} numberOfLines={1}>{user.bio}</Text>
              )}
            </View>
            <MessageCircle size={20} color={Colors.primary} />
          </TouchableOpacity>
        ))}

        {searchQuery.length < 2 && (
          <View style={styles.instructionsContainer}>
            <Search size={48} color={Colors.textSecondary} />
            <Text style={styles.instructionsText}>
              {activeTab === 'destinations' ? 
                'Digite pelo menos 2 caracteres para buscar destinos' :
                'Digite pelo menos 2 caracteres para buscar usuários'
              }
            </Text>
            {activeTab === 'destinations' && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Destinos populares:</Text>
                <View style={styles.suggestionTags}>
                  <TouchableOpacity style={styles.suggestionTag} onPress={() => handleSearch('Chapada')}>
                    <Text style={styles.suggestionTagText}>Chapada dos Veadeiros</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.suggestionTag} onPress={() => handleSearch('Bonito')}>
                    <Text style={styles.suggestionTagText}>Bonito</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.suggestionTag} onPress={() => handleSearch('Lençóis')}>
                    <Text style={styles.suggestionTagText}>Lençóis Maranhenses</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.textLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.cardDark,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userUsername: {
    color: Colors.primary,
    fontSize: 14,
    marginTop: 2,
  },
  userBio: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  instructionsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  instructionsText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  suggestionsContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  suggestionsTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  suggestionTagText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: '500',
  },
  destinationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  destinationImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.cardDark,
  },
  destinationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  destinationName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  destinationState: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  destinationType: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  destinationStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});