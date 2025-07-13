import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { 
  MapPin, 
  Navigation, 
  Settings,
  Play,
  Square,
  Wifi,
  WifiOff,
  Map,
  BarChart3
} from 'lucide-react-native';
import { useGPSStore } from '@/store/gpsStore';
import Colors from '@/constants/colors';

export default function GPSStatusCard() {
  const {
    isTracking,
    currentLocation,
    offlineQueueSize,
    lastSyncTime,
    isLoading,
    refreshStatus,
  } = useGPSStore();

  useEffect(() => {
    refreshStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Nunca';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const getStatusColor = () => {
    if (isTracking) return Colors.success;
    return Colors.textSecondary;
  };

  const getStatusText = () => {
    if (isLoading) return 'Carregando...';
    if (isTracking) return 'Rastreamento Ativo';
    return 'Rastreamento Inativo';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MapPin size={20} color={getStatusColor()} />
          <Text style={styles.title}>GPS Tracker</Text>
        </View>
        
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Current Location */}
        {currentLocation && (
          <View style={styles.infoRow}>
            <Navigation size={16} color={Colors.success} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Localização Atual</Text>
              <Text style={styles.infoValue}>
                {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </Text>
              {currentLocation.accuracy && (
                <Text style={styles.infoSubtext}>
                  Precisão: {Math.round(currentLocation.accuracy)}m
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Offline Status */}
        <View style={styles.infoRow}>
          {offlineQueueSize > 0 ? (
            <WifiOff size={16} color={Colors.warning} />
          ) : (
            <Wifi size={16} color={Colors.success} />
          )}
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Status de Sincronização</Text>
            <Text style={styles.infoValue}>
              {offlineQueueSize > 0 
                ? `${offlineQueueSize} localizações offline`
                : 'Sincronizado'
              }
            </Text>
            <Text style={styles.infoSubtext}>
              Última sync: {formatLastSync(lastSyncTime)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/gps-map')}
        >
          <Map size={18} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Ver Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/gps-settings')}
        >
          <Settings size={18} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Configurar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '500',
  },
});