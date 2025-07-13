import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { User } from '@/types';
import Colors from '@/constants/colors';
import { Award, MapPin, Bike } from 'lucide-react-native';

interface ProfileHeaderProps {
  user: User;
  onEditProfile?: () => void;
}

export default function ProfileHeader({ user, onEditProfile }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.location}>{user.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Bike size={16} color={Colors.textSecondary} />
            <Text style={styles.motorcycle}>{user.motorcycle}</Text>
          </View>
        </View>
      </View>
      
      {onEditProfile && (
        <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.bio}>{user.bio}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Award size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{user.medals.length}</Text>
          <Text style={styles.statLabel}>Medalhas</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.completedRoutes.length}</Text>
          <Text style={styles.statLabel}>Rotas</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.friends.length}</Text>
          <Text style={styles.statLabel}>Amigos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  location: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  motorcycle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  editButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  bio: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
  },
});