import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, MapPin, UserPlus } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/colors';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string;
  region: string;
}

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  
  const joinCommunityMutation = trpc.communities.join.useMutation({
    onSuccess: () => {
      // Invalidate communities list to refresh the data
      utils.communities.list.invalidate();
      
      Alert.alert(
        'Sucesso!',
        `Você entrou na comunidade ${community.name}!`
      );
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.message || 'Erro ao entrar na comunidade');
    },
  });

  const handleJoinCommunity = (e: any) => {
    e.stopPropagation();
    
    Alert.alert(
      'Entrar na Comunidade',
      `Deseja entrar na comunidade "${community.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Entrar', 
          onPress: () => {
            joinCommunityMutation.mutate({ communityId: community.id });
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/community/${community.id}`)}
    >
      <Image source={{ uri: community.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{community.name}</Text>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={handleJoinCommunity}
            disabled={joinCommunityMutation.isPending}
          >
            <UserPlus size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {community.description}
        </Text>
        
        <View style={styles.infoContainer}>
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
        </View>
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
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  joinButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.cardDark,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  membersText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  regionText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});