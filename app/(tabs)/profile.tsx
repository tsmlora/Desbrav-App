import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import { ChevronRight, Edit, Search, Settings, LogOut, User, Bike, MapPin } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, refreshProfile } = useAuthStore();

  // Refresh profile data when screen loads
  useEffect(() => {
    console.log('Profile screen loaded, refreshing profile...');
    refreshProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Usuário não encontrado</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={refreshProfile}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ 
            uri: user.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' 
          }} 
          style={styles.avatar} 
        />
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.email}</Text>
          
          {user.bio ? (
            <Text style={styles.bio}>{user.bio}</Text>
          ) : (
            <Text style={styles.emptyBio}>Adicione uma bio no seu perfil</Text>
          )}
          
          {user.motorcycle ? (
            <View style={styles.infoRow}>
              <Bike size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{user.motorcycle}</Text>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Bike size={16} color={Colors.textSecondary} />
              <Text style={styles.emptyInfo}>Adicione sua motocicleta</Text>
            </View>
          )}
          
          {user.location ? (
            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{user.location}</Text>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.emptyInfo}>Adicione sua localização</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => router.push('/edit-profile')}
        >
          <Edit size={16} color={Colors.background} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Medalhas</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Rotas</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Amigos</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações</Text>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => router.push('/search')}
        >
          <Search size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Buscar Usuários</Text>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Settings size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Configurações</Text>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.accent} />
          <Text style={[styles.actionText, styles.logoutText]}>Sair</Text>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={refreshProfile}
      >
        <Text style={styles.refreshButtonText}>Atualizar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  profileHeader: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  emptyBio: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  actionText: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    marginLeft: 12,
  },
  logoutItem: {
    borderColor: Colors.accent,
    borderWidth: 1,
  },
  logoutText: {
    color: Colors.accent,
  },
  refreshButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  refreshButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});