import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/colors';
import CommunityCard from '@/components/CommunityCard';
import EventCard from '@/components/EventCard';
import { Search, Plus } from 'lucide-react-native';

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'communities' | 'events'>('communities');
  
  // Fetch real communities from Supabase
  const { data: communities = [], isLoading: loadingCommunities } = trpc.communities.list.useQuery();
  
  // Fetch real events from Supabase
  const { data: events = [], isLoading: loadingEvents } = trpc.events.list.useQuery();

  const handleCreatePress = () => {
    if (activeTab === 'communities') {
      router.push('/create-community');
    } else {
      router.push('/create-event');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'communities' && styles.activeTab]}
          onPress={() => setActiveTab('communities')}
        >
          <Text style={[styles.tabText, activeTab === 'communities' && styles.activeTabText]}>
            Comunidades
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Eventos
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => router.push('/search')}
      >
        <Search size={20} color={Colors.textSecondary} />
        <Text style={styles.searchPlaceholder}>
          {activeTab === 'communities' 
            ? 'Buscar comunidades...' 
            : 'Buscar eventos...'}
        </Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'communities' ? (
          loadingCommunities ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Carregando comunidades...</Text>
            </View>
          ) : communities.length > 0 ? (
            communities.map(community => (
              <CommunityCard 
                key={community.id} 
                community={{
                  id: community.id,
                  name: community.name,
                  description: community.description,
                  members: community.members || 0,
                  image: community.image_url || 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
                  region: community.region || 'Brasil'
                }} 
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma comunidade encontrada.</Text>
              <Text style={styles.emptySubtext}>Seja o primeiro a criar uma comunidade!</Text>
            </View>
          )
        ) : (
          loadingEvents ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Carregando eventos...</Text>
            </View>
          ) : events.length > 0 ? (
            events.map(event => (
              <EventCard 
                key={event.id} 
                event={{
                  id: event.id,
                  title: event.title,
                  description: event.description,
                  date: event.date,
                  location: event.location,
                  organizer: event.creator?.name || 'Organizador',
                  participants: [], // We'll need to implement participants later
                  image: event.image_url || 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
                  coordinates: {
                    latitude: 0,
                    longitude: 0
                  }
                }} 
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum evento encontrado.</Text>
              <Text style={styles.emptySubtext}>Crie o primeiro evento da comunidade!</Text>
            </View>
          )
        )}
      </ScrollView>
      
      <TouchableOpacity style={styles.createButton} onPress={handleCreatePress}>
        <Plus size={20} color={Colors.background} />
        <Text style={styles.createButtonText}>
          {activeTab === 'communities' 
            ? 'Criar Comunidade' 
            : 'Criar Evento'}
        </Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchPlaceholder: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 12,
  },
  createButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  createButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});