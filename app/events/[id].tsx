import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Calendar, MapPin, Users, Navigation, Share2, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events } = useAppStore();
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const event = events.find(e => e.id === id);
  
  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Evento não encontrado</Text>
      </View>
    );
  }

  // Format date to Brazilian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const openMaps = () => {
    const { latitude, longitude } = event.coordinates;
    const label = event.location;
    
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${label}`,
      android: `geo:${latitude},${longitude}?q=${label}`,
      web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleParticipate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsParticipating(!isParticipating);
      setIsLoading(false);
      Alert.alert(
        'Sucesso', 
        isParticipating ? 'Você saiu do evento' : 'Você está participando do evento!'
      );
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: event.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.infoRow}>
          <Calendar size={16} color={Colors.primary} />
          <Text style={styles.dateText}>{formatDate(event.date)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{event.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Users size={16} color={Colors.textSecondary} />
          <Text style={styles.participantsText}>
            {event.participants.length + (isParticipating ? 1 : 0)} {event.participants.length === 1 ? 'participante' : 'participantes'}
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>Sobre o Evento</Text>
        <Text style={styles.description}>{event.description}</Text>
        
        <View style={styles.organizerContainer}>
          <Text style={styles.organizerLabel}>Organizado por:</Text>
          <Text style={styles.organizerName}>{event.organizer}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={openMaps}>
            <Navigation size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Navegar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.participateButton, 
            isParticipating && styles.participatingButton,
            isLoading && styles.disabledButton
          ]}
          onPress={handleParticipate}
          disabled={isLoading}
        >
          {isParticipating && <Check size={20} color={Colors.background} />}
          <Text style={styles.participateButtonText}>
            {isLoading 
              ? 'Processando...' 
              : isParticipating 
                ? 'Participando' 
                : 'Participar do Evento'
            }
          </Text>
        </TouchableOpacity>
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
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  dateText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  participantsText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  organizerLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginRight: 4,
  },
  organizerName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: Colors.primary,
    fontSize: 14,
    marginTop: 4,
  },
  participateButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  participatingButton: {
    backgroundColor: Colors.success,
  },
  disabledButton: {
    opacity: 0.6,
  },
  participateButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});