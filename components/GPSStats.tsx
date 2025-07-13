import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { 
  MapPin, 
  Navigation, 
  Clock,
  Zap,
  TrendingUp,
  Route
} from 'lucide-react-native';
import { useGPS } from '@/hooks/useGPS';

interface GPSStatsProps {
  showTitle?: boolean;
  compact?: boolean;
}

export default function GPSStats({ showTitle = true, compact = false }: GPSStatsProps) {
  const { 
    locationHistory, 
    currentLocation,
    getTotalDistance,
    getAverageSpeed,
    isTracking 
  } = useGPS();

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const formatSpeed = (kmh: number) => {
    return `${Math.round(kmh)} km/h`;
  };

  const getTrackingDuration = () => {
    if (locationHistory.length < 2) return '0min';
    
    const firstLocation = locationHistory[locationHistory.length - 1];
    const lastLocation = locationHistory[0];
    const duration = lastLocation.timestamp - firstLocation.timestamp;
    
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    }
    return `${minutes}min`;
  };

  const getCurrentAccuracy = () => {
    if (!currentLocation?.accuracy) return 'N/A';
    return `${Math.round(currentLocation.accuracy)}m`;
  };

  const stats = [
    {
      icon: Route,
      label: 'Distância Total',
      value: formatDistance(getTotalDistance()),
      color: '#4CAF50',
    },
    {
      icon: Zap,
      label: 'Velocidade Média',
      value: formatSpeed(getAverageSpeed()),
      color: '#FF9800',
    },
    {
      icon: Clock,
      label: 'Duração',
      value: getTrackingDuration(),
      color: '#2196F3',
    },
    {
      icon: Navigation,
      label: 'Precisão',
      value: getCurrentAccuracy(),
      color: '#9C27B0',
    },
    {
      icon: MapPin,
      label: 'Pontos Coletados',
      value: locationHistory.length.toString(),
      color: '#607D8B',
    },
    {
      icon: TrendingUp,
      label: 'Status',
      value: isTracking ? 'Ativo' : 'Inativo',
      color: isTracking ? '#4CAF50' : '#666',
    },
  ];

  if (compact) {
    const compactStats = stats.slice(0, 3);
    return (
      <View style={styles.compactContainer}>
        {compactStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <View key={index} style={styles.compactStat}>
              <IconComponent size={16} color={stat.color} />
              <Text style={styles.compactValue}>{stat.value}</Text>
              <Text style={styles.compactLabel}>{stat.label}</Text>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={styles.title}>Estatísticas GPS</Text>
      )}
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <IconComponent size={20} color={stat.color} />
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'space-around',
  },
  compactStat: {
    alignItems: 'center',
    flex: 1,
  },
  compactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  compactLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
  },
});