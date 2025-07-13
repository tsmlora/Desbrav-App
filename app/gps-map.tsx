import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { 
  MapPin, 
  Navigation, 
  Crosshair,
  Play,
  Square,
} from 'lucide-react-native';
import { useGPS } from '@/hooks/useGPS';
import { GPSCoordinate } from '@/lib/gpsTracker';

// Web fallback component
function WebMapFallback({ currentLocation }: { currentLocation: GPSCoordinate | null }) {
  return (
    <View style={styles.webFallback}>
      <MapPin size={64} color="#4CAF50" />
      <Text style={styles.webFallbackTitle}>Mapa não disponível na web</Text>
      <Text style={styles.webFallbackText}>
        O mapa GPS está disponível apenas em dispositivos móveis.
      </Text>
      
      {currentLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>Localização Atual:</Text>
          <Text style={styles.locationText}>
            Lat: {currentLocation.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Lng: {currentLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function GPSMapScreen() {
  const {
    isTracking,
    currentLocation,
    locationHistory,
    isLoading,
    error,
    startTracking,
    stopTracking,
    getCurrentLocation,
    getLocationHistory,
    clearError,
  } = useGPS();

  const [selectedLocation, setSelectedLocation] = useState<GPSCoordinate | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await getCurrentLocation();
    await getLocationHistory();
  };

  const handleToggleTracking = async () => {
    if (isTracking) {
      await stopTracking();
    } else {
      const success = await startTracking();
      if (!success && error) {
        Alert.alert('Erro', error);
      }
    }
  };

  const handleCenterOnCurrentLocation = async () => {
    await getCurrentLocation();
  };

  const formatLocationInfo = (location: GPSCoordinate) => {
    const date = new Date(location.timestamp);
    return {
      time: date.toLocaleTimeString('pt-BR'),
      date: date.toLocaleDateString('pt-BR'),
      accuracy: location.accuracy ? `${Math.round(location.accuracy)}m` : 'N/A',
      speed: location.speed ? `${Math.round(location.speed * 3.6)} km/h` : 'N/A',
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Mapa GPS',
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#fff',
        }} 
      />
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <WebMapFallback currentLocation={currentLocation} />
        ) : (
          <>
            <View style={styles.mapPlaceholder}>
              <MapPin size={48} color="#4CAF50" />
              <Text style={styles.mapPlaceholderText}>
                Mapa será carregado aqui
              </Text>
              <Text style={styles.mapPlaceholderSubtext}>
                React Native Maps não está configurado
              </Text>
            </View>

            {/* Control buttons */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={[styles.controlButton, isTracking && styles.activeButton]}
                onPress={handleToggleTracking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : isTracking ? (
                  <Square size={20} color="#fff" />
                ) : (
                  <Play size={20} color="#fff" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleCenterOnCurrentLocation}
              >
                <Crosshair size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                disabled={locationHistory.length === 0}
              >
                <Navigation size={20} color={locationHistory.length === 0 ? '#666' : '#fff'} />
              </TouchableOpacity>
            </View>

            {/* Status bar */}
            <View style={styles.statusBar}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[styles.statusValue, { color: isTracking ? '#4CAF50' : '#FF5252' }]}>
                  {isTracking ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Pontos:</Text>
                <Text style={styles.statusValue}>{locationHistory.length}</Text>
              </View>
              
              {currentLocation?.accuracy && (
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Precisão:</Text>
                  <Text style={styles.statusValue}>{Math.round(currentLocation.accuracy)}m</Text>
                </View>
              )}
            </View>

            {/* Selected location info */}
            {selectedLocation && (
              <View style={styles.locationInfoPanel}>
                <View style={styles.locationInfoHeader}>
                  <Text style={styles.locationInfoTitle}>Informações do Ponto</Text>
                  <TouchableOpacity onPress={() => setSelectedLocation(null)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.locationInfoContent}>
                  <Text style={styles.locationInfoText}>
                    📍 {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.locationInfoText}>
                    🕒 {formatLocationInfo(selectedLocation).time} - {formatLocationInfo(selectedLocation).date}
                  </Text>
                  <Text style={styles.locationInfoText}>
                    🎯 Precisão: {formatLocationInfo(selectedLocation).accuracy}
                  </Text>
                  <Text style={styles.locationInfoText}>
                    🚗 Velocidade: {formatLocationInfo(selectedLocation).speed}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  webFallbackText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  locationInfo: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: '#FF5252',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  errorButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  mapPlaceholderText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
    fontWeight: '600',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  controlsContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
    gap: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  statusBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  locationInfoPanel: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 80,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 12,
    padding: 16,
  },
  locationInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  closeButton: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: 'bold',
  },
  locationInfoContent: {
    gap: 6,
  },
  locationInfoText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
});