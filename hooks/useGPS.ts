import { useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { useGPSStore } from '@/store/gpsStore';
import { gpsTracker, GPSCoordinate, GPSSettings } from '@/lib/gpsTracker';

export interface UseGPSOptions {
  autoStart?: boolean;
  showPermissionAlert?: boolean;
  syncInterval?: number;
}

export function useGPS(options: UseGPSOptions = {}) {
  const {
    autoStart = false,
    showPermissionAlert = true,
    syncInterval = 5 * 60 * 1000,
  } = options;

  const {
    isTracking,
    currentLocation,
    locationHistory,
    settings,
    offlineQueueSize,
    lastSyncTime,
    error,
    isLoading,
    setTracking,
    setCurrentLocation,
    setLocationHistory,
    setSettings,
    setOfflineQueueSize,
    setLastSyncTime,
    setError,
    setLoading,
    clearError,
  } = useGPSStore();

  const refreshStatus = useCallback(() => {
    setTracking(gpsTracker.isTrackingActive());
    setSettings(gpsTracker.getSettings());
    setOfflineQueueSize(gpsTracker.getOfflineQueueSize());
  }, [setTracking, setSettings, setOfflineQueueSize]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    if (autoStart && !isTracking) {
      handleStartTracking();
    }
  }, [autoStart]);

  useEffect(() => {
    if (syncInterval > 0) {
      const interval = setInterval(() => {
        if (offlineQueueSize > 0) {
          syncOfflineData();
        }
      }, syncInterval);

      return () => clearInterval(interval);
    }
  }, [syncInterval, offlineQueueSize]);

  const handleStartTracking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const hasPermission = await gpsTracker.requestPermissions();
      
      if (!hasPermission) {
        if (showPermissionAlert) {
          Alert.alert(
            'Permissão Necessária',
            'Para usar o rastreamento GPS, é necessário conceder permissão de localização.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Tentar Novamente', 
                onPress: () => handleStartTracking()
              },
            ]
          );
        }
        setLoading(false);
        return false;
      }

      const success = await gpsTracker.startTracking();
      
      if (success) {
        setTracking(true);
        setSettings(gpsTracker.getSettings());
      } else {
        setError('Falha ao iniciar o rastreamento GPS');
      }
      
      setLoading(false);
      return success;
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      setLoading(false);
      
      if (showPermissionAlert) {
        Alert.alert('Erro', 'Falha ao iniciar o rastreamento GPS');
      }
      return false;
    }
  }, [setLoading, setError, setTracking, setSettings, showPermissionAlert]);

  const handleStopTracking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await gpsTracker.stopTracking();
      
      setTracking(false);
      setSettings(gpsTracker.getSettings());
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error stopping GPS tracking:', error);
      setError(error instanceof Error ? error.message : 'Erro ao parar rastreamento');
      setLoading(false);
      Alert.alert('Erro', 'Falha ao parar o rastreamento GPS');
      return false;
    }
  }, [setLoading, setError, setTracking, setSettings]);

  const toggleTracking = useCallback(async () => {
    if (isTracking) {
      return await handleStopTracking();
    } else {
      return await handleStartTracking();
    }
  }, [isTracking, handleStartTracking, handleStopTracking]);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await gpsTracker.getCurrentLocation();
      setCurrentLocation(location);
      setLoading(false);
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      setError(error instanceof Error ? error.message : 'Erro ao obter localização atual');
      setLoading(false);
      return null;
    }
  }, [setLoading, setError, setCurrentLocation]);

  const getLocationHistory = useCallback(async (limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const history = await gpsTracker.getLocationHistory(limit);
      setLocationHistory(history);
      setLoading(false);
      return history;
    } catch (error) {
      console.error('Error loading location history:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar histórico');
      setLoading(false);
      return [];
    }
  }, [setLoading, setError, setLocationHistory]);

  const syncOfflineData = useCallback(async () => {
    try {
      setError(null);
      
      await gpsTracker.syncOfflineData();
      
      setOfflineQueueSize(gpsTracker.getOfflineQueueSize());
      setLastSyncTime(Date.now());
      return true;
    } catch (error) {
      console.error('Error syncing offline data:', error);
      setError(error instanceof Error ? error.message : 'Erro ao sincronizar dados offline');
      return false;
    }
  }, [setError, setOfflineQueueSize, setLastSyncTime]);

  const clearLocationHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await gpsTracker.clearLocationHistory();
      
      setLocationHistory([]);
      setOfflineQueueSize(0);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error clearing location history:', error);
      setError(error instanceof Error ? error.message : 'Erro ao limpar histórico');
      setLoading(false);
      return false;
    }
  }, [setLoading, setError, setLocationHistory, setOfflineQueueSize]);

  const updateSettings = useCallback(async (newSettings: Partial<GPSSettings>) => {
    try {
      setLoading(true);
      setError(null);
      
      await gpsTracker.updateSettings(newSettings);
      
      setSettings(gpsTracker.getSettings());
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error updating GPS settings:', error);
      setError(error instanceof Error ? error.message : 'Erro ao atualizar configurações');
      setLoading(false);
      return false;
    }
  }, [setLoading, setError, setSettings]);

  const getDistanceBetween = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const getTotalDistance = useCallback(() => {
    if (locationHistory.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < locationHistory.length; i++) {
      const prev = locationHistory[i - 1];
      const curr = locationHistory[i];
      totalDistance += getDistanceBetween(
        prev.latitude, prev.longitude,
        curr.latitude, curr.longitude
      );
    }
    return totalDistance;
  }, [locationHistory, getDistanceBetween]);

  const getAverageSpeed = useCallback(() => {
    if (locationHistory.length < 2) return 0;
    
    const speeds = locationHistory
      .filter(loc => loc.speed && loc.speed > 0)
      .map(loc => loc.speed! * 3.6);
    
    if (speeds.length === 0) return 0;
    
    const sum = speeds.reduce((acc, speed) => acc + speed, 0);
    return sum / speeds.length;
  }, [locationHistory]);

  const isSupported = Platform.OS !== 'web';

  return {
    isTracking,
    currentLocation,
    locationHistory,
    settings,
    offlineQueueSize,
    lastSyncTime,
    error,
    isLoading,
    isSupported,

    startTracking: handleStartTracking,
    stopTracking: handleStopTracking,
    toggleTracking,
    getCurrentLocation,
    getLocationHistory,
    syncOfflineData,
    clearLocationHistory,
    updateSettings,
    clearError,
    refreshStatus,

    getDistanceBetween,
    getTotalDistance,
    getAverageSpeed,
  };
}