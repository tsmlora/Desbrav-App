import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star } from 'lucide-react-native';
import { RestPlace } from '@/constants/restPlaces';
import Colors from '@/constants/colors';

interface RestPlaceCardProps {
  place: RestPlace;
}

export default function RestPlaceCard({ place }: RestPlaceCardProps) {
  const router = useRouter();

  const renderPrice = () => {
    const price = place.price;
    return (
      <Text style={styles.priceText}>
        {price === '€' ? '€' : price === '€€' ? '€€' : '€€€'}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/rest-places/${place.id}`)}
    >
      <Image source={{ uri: place.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{place.type}</Text>
          {renderPrice()}
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.location}>{place.address}</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
        </View>
        
        <View style={styles.amenitiesContainer}>
          {place.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityBadge}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {place.amenities.length > 3 && (
            <Text style={styles.moreText}>+{place.amenities.length - 3}</Text>
          )}
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  location: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  ratingText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityBadge: {
    backgroundColor: Colors.cardDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amenityText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  moreText: {
    color: Colors.textSecondary,
    fontSize: 12,
    alignSelf: 'center',
  },
});