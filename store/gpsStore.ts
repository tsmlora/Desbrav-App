import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { GPSCoordinate, GPSSettings, gpsTracker } from '@/lib/gpsTracker';

interface GPSStore {
  isTracking: boolean;
  currentLocation: GPSCoordinate | null;
  locationHistory: GPSCoordinate[];
  settings: GPSSettings;
  offlineQueueSize: number;
  lastSyncTime: number | null;
  error: string | null;
  isLoading: boolean;

  setTracking: (isTracking: boolean) => void;
  setCurrentLocation: (location: GPSCoordinate | null) => void;
  setLocationHistory: (history: GPSCoordinate[]) => void;
  setSettings: (settings: GPSSettings) => void;
  setOfflineQueueSize: (size: number) => void;
  setLastSyncTime: (time: number | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  refreshStatus: () => void;
}

export const useGPSStore = create<GPSStore>()(
  persist(
    (set, get) => ({
      isTracking: false,
      currentLocation: null,
      locationHistory: [],
      settings: {
        isEnabled: false,
        accuracy: Location.LocationAccuracy.Balanced,
        distanceInterval: 10,
        timeInterval: 5000,
        enableBackground: true,
      },
      offlineQueueSize: 0,
      lastSyncTime: null,
      error: null,
      isLoading: false,

      setTracking: (isTracking) => set({ isTracking }),
      setCurrentLocation: (currentLocation) => set({ currentLocation }),
      setLocationHistory: (locationHistory) => set({ locationHistory }),
      setSettings: (settings) => set({ settings }),
      setOfflineQueueSize: (offlineQueueSize) => set({ offlineQueueSize }),
      setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      clearError: () => set({ error: null }),
      refreshStatus: () => {
        const { setTracking, setSettings, setOfflineQueueSize } = get();
        setTracking(gpsTracker.isTrackingActive());
        setSettings(gpsTracker.getSettings());
        setOfflineQueueSize(gpsTracker.getOfflineQueueSize());
      },
    }),
    {
      name: 'gps-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);