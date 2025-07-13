import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, Star, Phone, Navigation, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';

export default function RestPlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { restPlaces } = useAppStore();
  
  const place = restPlaces.find(p => p.id === id);
  
  if (!place) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Local não encontrado</Text>
      </View>
    );
  }

  const openMaps = () => {
    const { latitude, longitude } = place.coordinates;
    const label = place.name;
    
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${label}`,
      android: `geo:${latitude},${longitude}?q=${label}`,
      web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderPrice = () => {
    const price = place.price;
    return (
      <Text style={styles.priceText}>
        {price === '€' ? '€' : price === '€€' ? '€€' : '€€€'}
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: place.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{place.type}</Text>
          {renderPrice()}
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
        </View>
        
        <View style={styles.addressContainer}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.addressText}>{place.address}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Sobre o Local</Text>
        <Text style={styles.description}>{place.description}</Text>
        
        <Text style={styles.sectionTitle}>Comodidades</Text>
        <View style={styles.amenitiesContainer}>
          {place.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityBadge}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={openMaps}>
            <Navigation size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Navegar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Ligar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.reviewButtonText}>Avaliar este local</Text>
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  priceText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  ratingText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 6,
  },
  addressText: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  amenityBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amenityText: {
    color: Colors.textSecondary,
    fontSize: 14,
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
  reviewButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});