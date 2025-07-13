import { useState } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export default function useLocation() {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [location, setLocationState] = useState<{
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    tracking: boolean;
  }>({ latitude: null, longitude: null, error: null, tracking: false });

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== 'granted') {
        setLocationState(prev => ({ ...prev, error: 'Permissão para acessar a localização foi negada' }));
        return false;
      }
      
      return true;
    } catch (error) {
      setLocationState(prev => ({ ...prev, error: 'Erro ao solicitar permissão de localização' }));
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      // Check permission status first
      if (permissionStatus !== 'granted') {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;
      }
      
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      if (locationResult && locationResult.coords) {
        setLocationState(prev => ({
          ...prev,
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
          error: null
        }));
      }
    } catch (error) {
      setLocationState(prev => ({ ...prev, error: 'Erro ao obter localização atual' }));
    }
  };

  const startLocationTracking = async () => {
    try {
      // Check permission status first
      if (permissionStatus !== 'granted') {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;
      }
      
      setLocationState(prev => ({ ...prev, tracking: true }));
      
      // For now, just get current location instead of continuous tracking
      await getCurrentLocation();
    } catch (error) {
      setLocationState(prev => ({ ...prev, error: 'Erro ao iniciar rastreamento de localização' }));
    }
  };

  return {
    location,
    permissionStatus,
    requestPermission,
    getCurrentLocation,
    startLocationTracking,
    isTracking: location.tracking
  };
}