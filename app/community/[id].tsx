import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Users, MapPin, MessageCircle, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import EventCard from '@/components/EventCard';

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { communities, events } = useAppStore();
  
  const community = communities.find(c => c.id === id);
  
  if (!community) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Comunidade não encontrada</Text>
      </View>
    );
  }
  
  // Filter events by this community as organizer
  const communityEvents = events.filter(event => event.organizer === community.name);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: community.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{community.name}</Text>
        
        <View style={styles.infoRow}>
          <Users size={16} color={Colors.textSecondary} />
          <Text style={styles.membersText}>
            {community.members} {community.members === 1 ? 'membro' : 'membros'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.regionText}>{community.region}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Sobre a Comunidade</Text>
        <Text style={styles.description}>{community.description}</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Participar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.messageButton}>
            <MessageCircle size={20} color={Colors.primary} />
            <Text style={styles.messageButtonText}>Mensagem</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        {communityEvents.length > 0 ? (
          communityEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Calendar size={24} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>
              Esta comunidade não tem eventos programados.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

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
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  membersText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  regionText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  joinButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  messageButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});