import { useEffect, useCallback } from 'react';
import { useAchievementStore } from '@/store/achievementStore';
import { useGPS } from '@/hooks/useGPS';
import { SpeedRecord } from '@/types/achievements';

export function useAchievementTracker() {
  const {
    addDistance,
    addCity,
    completeRoute,
    addGroupRide,
    addShare,
    addSpeedRecord,
    checkAchievements,
  } = useAchievementStore();

  const { locationHistory, currentLocation, getTotalDistance, getAverageSpeed } = useGPS();

  // Track distance achievements
  useEffect(() => {
    if (locationHistory.length >= 2) {
      const totalDistance = getTotalDistance();
      if (totalDistance > 0) {
        addDistance(totalDistance * 1000); // Convert km to meters
      }
    }
  }, [locationHistory, getTotalDistance, addDistance]);

  // Track speed achievements
  useEffect(() => {
    if (locationHistory.length >= 10) { // Need sufficient data points
      const averageSpeed = getAverageSpeed();
      
      if (averageSpeed > 0) {
        const speedRecord: SpeedRecord = {
          date: new Date().toISOString().split('T')[0],
          average_speed: averageSpeed,
          max_speed: Math.max(...locationHistory.map(loc => (loc.speed || 0) * 3.6)),
          duration: calculateTripDuration(),
          consistency_score: calculateConsistencyScore(),
        };
        
        addSpeedRecord(speedRecord);
      }
    }
  }, [locationHistory, getAverageSpeed, addSpeedRecord]);

  const calculateTripDuration = useCallback((): number => {
    if (locationHistory.length < 2) return 0;
    
    const startTime = locationHistory[0].timestamp;
    const endTime = locationHistory[locationHistory.length - 1].timestamp;
    
    return (endTime - startTime) / (1000 * 60); // Convert to minutes
  }, [locationHistory]);

  const calculateConsistencyScore = useCallback((): number => {
    if (locationHistory.length < 5) return 0;
    
    const speeds = locationHistory
      .filter(loc => loc.speed && loc.speed > 0)
      .map(loc => loc.speed! * 3.6); // Convert to km/h
    
    if (speeds.length < 3) return 0;
    
    const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const variance = speeds.reduce((sum, speed) => sum + Math.pow(speed - avgSpeed, 2), 0) / speeds.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency score
    return Math.max(0, 100 - (standardDeviation / avgSpeed) * 100);
  }, [locationHistory]);

  // Manual tracking functions for social achievements
  const trackGroupRide = useCallback(() => {
    addGroupRide();
  }, [addGroupRide]);

  const trackShare = useCallback(() => {
    addShare();
  }, [addShare]);

  const trackCityVisit = useCallback((cityName: string) => {
    addCity(cityName);
  }, [addCity]);

  const trackRouteCompletion = useCallback((routeId: string) => {
    completeRoute(routeId);
  }, [completeRoute]);

  // Force check achievements
  const forceCheckAchievements = useCallback(() => {
    return checkAchievements();
  }, [checkAchievements]);

  return {
    trackGroupRide,
    trackShare,
    trackCityVisit,
    trackRouteCompletion,
    forceCheckAchievements,
  };
}