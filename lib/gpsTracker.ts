import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Only import background tasks on native platforms
let TaskManager: any = null;
let BackgroundFetch: any = null;

if (Platform.OS !== 'web') {
  try {
    TaskManager = require('expo-task-manager');
    BackgroundFetch = require('expo-background-fetch');
  } catch (error) {
    console.warn('Background tasks not available:', error);
  }
}

const LOCATION_TASK_NAME = 'background-location-task';
const BACKGROUND_FETCH_TASK = 'background-fetch-task';
const OFFLINE_LOCATIONS_KEY = 'offline_locations';
const GPS_SETTINGS_KEY = 'gps_settings';

export interface GPSCoordinate {
  id?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
  user_id?: string;
  synced: boolean;
}

export interface GPSSettings {
  isEnabled: boolean;
  accuracy: Location.LocationAccuracy;
  distanceInterval: number;
  timeInterval: number;
  enableBackground: boolean;
}

const DEFAULT_GPS_SETTINGS: GPSSettings = {
  isEnabled: false,
  accuracy: Location.LocationAccuracy.Balanced,
  distanceInterval: 10,
  timeInterval: 5000,
  enableBackground: true,
};

class GPSTracker {
  private isTracking = false;
  private settings: GPSSettings = DEFAULT_GPS_SETTINGS;
  private locationSubscription: Location.LocationSubscription | null = null;
  private offlineQueue: GPSCoordinate[] = [];

  constructor() {
    this.initializeSettings();
    if (Platform.OS !== 'web') {
      this.setupBackgroundTasks();
    }
  }

  private async initializeSettings() {
    try {
      const savedSettings = await AsyncStorage.getItem(GPS_SETTINGS_KEY);
      if (savedSettings) {
        this.settings = { ...DEFAULT_GPS_SETTINGS, ...JSON.parse(savedSettings) };
      }
      
      const offlineData = await AsyncStorage.getItem(OFFLINE_LOCATIONS_KEY);
      if (offlineData) {
        this.offlineQueue = JSON.parse(offlineData);
      }
    } catch (error) {
      console.error('Error initializing GPS settings:', error);
    }
  }

  private async setupBackgroundTasks() {
    if (Platform.OS === 'web' || !TaskManager || !BackgroundFetch) return;

    try {
      TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
        if (error) {
          console.error('Background location task error:', error);
          return;
        }
        if (data) {
          const { locations } = data as any;
          this.handleBackgroundLocations(locations);
        }
      });

      TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
        try {
          await this.syncOfflineData();
          return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (error) {
          console.error('Background fetch error:', error);
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }
      });

      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 15 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error('Error setting up background tasks:', error);
    }
  }

  private async handleBackgroundLocations(locations: Location.LocationObject[]) {
    for (const location of locations) {
      const coordinate: GPSCoordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
        speed: location.coords.speed || undefined,
        heading: location.coords.heading || undefined,
        timestamp: location.timestamp,
        synced: false,
      };

      await this.storeLocation(coordinate);
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        throw new Error('Foreground location permission not granted');
      }

      if (Platform.OS !== 'web' && this.settings.enableBackground) {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          console.warn('Background location permission not granted');
        }
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async startTracking(): Promise<boolean> {
    try {
      if (this.isTracking) {
        console.warn('GPS tracking is already active');
        return true;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permissions not granted');
      }

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: this.settings.accuracy,
          timeInterval: this.settings.timeInterval,
          distanceInterval: this.settings.distanceInterval,
        },
        (location) => {
          const coordinate: GPSCoordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude || undefined,
            accuracy: location.coords.accuracy || undefined,
            speed: location.coords.speed || undefined,
            heading: location.coords.heading || undefined,
            timestamp: location.timestamp,
            synced: false,
          };

          this.storeLocation(coordinate);
        }
      );

      if (Platform.OS !== 'web' && this.settings.enableBackground && TaskManager) {
        try {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: this.settings.accuracy,
            timeInterval: this.settings.timeInterval,
            distanceInterval: this.settings.distanceInterval,
            foregroundService: {
              notificationTitle: 'Rastreamento GPS Ativo',
              notificationBody: 'Sua localização está sendo rastreada em segundo plano.',
            },
          });
        } catch (error) {
          console.warn('Background location tracking not available:', error);
        }
      }

      this.isTracking = true;
      this.settings.isEnabled = true;
      await this.saveSettings();

      console.log('GPS tracking started successfully');
      return true;
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      return false;
    }
  }

  async stopTracking(): Promise<void> {
    try {
      if (!this.isTracking) {
        console.warn('GPS tracking is not active');
        return;
      }

      if (this.locationSubscription) {
        this.locationSubscription.remove();
        this.locationSubscription = null;
      }

      if (Platform.OS !== 'web' && TaskManager) {
        try {
          const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
          if (isTaskDefined) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
          }
        } catch (error) {
          console.warn('Error stopping background location updates:', error);
        }
      }

      this.isTracking = false;
      this.settings.isEnabled = false;
      await this.saveSettings();

      console.log('GPS tracking stopped successfully');
    } catch (error) {
      console.error('Error stopping GPS tracking:', error);
    }
  }

  private async storeLocation(coordinate: GPSCoordinate): Promise<void> {
    try {
      const isOnline = await this.isNetworkAvailable();
      
      if (isOnline) {
        await this.syncLocationToSupabase(coordinate);
      } else {
        await this.storeLocationOffline(coordinate);
      }
    } catch (error) {
      console.error('Error storing location:', error);
      await this.storeLocationOffline(coordinate);
    }
  }

  private async syncLocationToSupabase(coordinate: GPSCoordinate): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('gps_coordinates')
        .insert({
          ...coordinate,
          user_id: user.id,
          synced: true,
        });

      if (error) {
        throw error;
      }

      console.log('Location synced to Supabase successfully');
    } catch (error) {
      console.error('Error syncing location to Supabase:', error);
      throw error;
    }
  }

  private async storeLocationOffline(coordinate: GPSCoordinate): Promise<void> {
    try {
      this.offlineQueue.push(coordinate);
      
      if (this.offlineQueue.length > 1000) {
        this.offlineQueue = this.offlineQueue.slice(-1000);
      }

      await AsyncStorage.setItem(OFFLINE_LOCATIONS_KEY, JSON.stringify(this.offlineQueue));
      console.log('Location stored offline');
    } catch (error) {
      console.error('Error storing location offline:', error);
    }
  }

  async syncOfflineData(): Promise<void> {
    try {
      if (this.offlineQueue.length === 0) {
        return;
      }

      const isOnline = await this.isNetworkAvailable();
      if (!isOnline) {
        console.log('Device is offline, skipping sync');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('User not authenticated, skipping sync');
        return;
      }

      const locationsToSync = [...this.offlineQueue];
      const batchSize = 50;

      for (let i = 0; i < locationsToSync.length; i += batchSize) {
        const batch = locationsToSync.slice(i, i + batchSize).map(coord => ({
          ...coord,
          user_id: user.id,
          synced: true,
        }));

        const { error } = await supabase
          .from('gps_coordinates')
          .insert(batch);

        if (error) {
          console.error('Error syncing batch:', error);
          continue;
        }

        this.offlineQueue.splice(0, batch.length);
      }

      await AsyncStorage.setItem(OFFLINE_LOCATIONS_KEY, JSON.stringify(this.offlineQueue));
      console.log(`Synced ${locationsToSync.length - this.offlineQueue.length} locations`);
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }

  private async isNetworkAvailable(): Promise<boolean> {
    try {
      const { error } = await supabase.from('gps_coordinates').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  async updateSettings(newSettings: Partial<GPSSettings>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...newSettings };
      await this.saveSettings();

      if (this.isTracking) {
        await this.stopTracking();
        await this.startTracking();
      }
    } catch (error) {
      console.error('Error updating GPS settings:', error);
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem(GPS_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving GPS settings:', error);
    }
  }

  getSettings(): GPSSettings {
    return { ...this.settings };
  }

  isTrackingActive(): boolean {
    return this.isTracking;
  }

  getOfflineQueueSize(): number {
    return this.offlineQueue.length;
  }

  async getCurrentLocation(): Promise<GPSCoordinate | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: this.settings.accuracy,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
        speed: location.coords.speed || undefined,
        heading: location.coords.heading || undefined,
        timestamp: location.timestamp,
        synced: false,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  async getLocationHistory(limit: number = 100): Promise<GPSCoordinate[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('gps_coordinates')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting location history:', error);
      return [];
    }
  }

  async clearLocationHistory(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { error } = await supabase
        .from('gps_coordinates')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      this.offlineQueue = [];
      await AsyncStorage.removeItem(OFFLINE_LOCATIONS_KEY);

      console.log('Location history cleared');
    } catch (error) {
      console.error('Error clearing location history:', error);
    }
  }
}

export const gpsTracker = new GPSTracker();
export default gpsTracker;