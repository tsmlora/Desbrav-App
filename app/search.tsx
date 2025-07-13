import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, User, MessageCircle } from 'lucide-react-native';
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

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setIsSearching(true);
      // Simulate search
      setTimeout(() => {
        const results = mockUsers.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleStartChat = (selectedUser: any) => {
    router.push(`/chat/${selectedUser.id}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Buscar Usuários',
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuários..."
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

        {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
          <View style={styles.emptyContainer}>
            <User size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
            <Text style={styles.emptySubtext}>
              Tente buscar por nome ou nome de usuário
            </Text>
          </View>
        )}

        {searchResults.map((user) => (
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
              Digite pelo menos 2 caracteres para buscar usuários
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
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
});