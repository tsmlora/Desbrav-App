import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Users } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    organizer: string;
    participants: string[];
    image: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  // Format date to Brazilian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/events/${event.id}`)}
    >
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
            {event.participants.length} {event.participants.length === 1 ? 'participante' : 'participantes'}
          </Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>
        
        <View style={styles.organizerContainer}>
          <Text style={styles.organizerLabel}>Organizado por:</Text>
          <Text style={styles.organizerName}>{event.organizer}</Text>
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
  title: {
    fontSize: 18,
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
  dateText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  participantsText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginVertical: 8,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  organizerLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginRight: 4,
  },
  organizerName: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
});