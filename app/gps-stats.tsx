import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { 
  BarChart3, 
  MapPin, 
  Calendar,
  TrendingUp,
} from 'lucide-react-native';
import { useGPS } from '@/hooks/useGPS';

export default function GPSStatsScreen() {
  const { 
    locationHistory, 
    getLocationHistory,
    getTotalDistance,
    getAverageSpeed,
    isLoading 
  } = useGPS();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await getLocationHistory();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getFilteredLocations = () => {
    const now = Date.now();
    const periods = {
      today: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };

    const cutoff = now - periods[selectedPeriod];
    return locationHistory.filter(loc => loc.timestamp >= cutoff);
  };

  const getDetailedStats = () => {
    const filteredLocations = getFilteredLocations();
    
    if (filteredLocations.length < 2) {
      return {
        totalDistance: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        totalTime: 0,
        pointsCollected: filteredLocations.length,
        averageAccuracy: 0,
      };
    }

    let totalDistance = 0;
    for (let i = 1; i < filteredLocations.length; i++) {
      const prev = filteredLocations[i - 1];
      const curr = filteredLocations[i];
      const R = 6371;
      const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
      const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      totalDistance += R * c;
    }

    const speeds = filteredLocations
      .filter(loc => loc.speed && loc.speed > 0)
      .map(loc => loc.speed! * 3.6);

    const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;

    const firstLocation = filteredLocations[filteredLocations.length - 1];
    const lastLocation = filteredLocations[0];
    const totalTime = lastLocation.timestamp - firstLocation.timestamp;

    const accuracies = filteredLocations
      .filter(loc => loc.accuracy)
      .map(loc => loc.accuracy!);
    const averageAccuracy = accuracies.length > 0 ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length : 0;

    return {
      totalDistance,
      averageSpeed,
      maxSpeed,
      totalTime,
      pointsCollected: filteredLocations.length,
      averageAccuracy,
    };
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(2)}km`;
  };

  const stats = getDetailedStats();
  const periods = [
    { key: 'today', label: 'Hoje' },
    { key: 'week', label: '7 dias' },
    { key: 'month', label: '30 dias' },
    { key: 'all', label: 'Tudo' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Estatísticas GPS',
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.selectedPeriodButton
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.selectedPeriodButtonText
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Stats Cards */}
        <View style={styles.mainStatsContainer}>
          <View style={styles.mainStatCard}>
            <View style={styles.mainStatHeader}>
              <MapPin size={24} color="#4CAF50" />
              <Text style={styles.mainStatLabel}>Distância Total</Text>
            </View>
            <Text style={styles.mainStatValue}>{formatDistance(stats.totalDistance)}</Text>
          </View>

          <View style={styles.mainStatCard}>
            <View style={styles.mainStatHeader}>
              <TrendingUp size={24} color="#FF9800" />
              <Text style={styles.mainStatLabel}>Velocidade Média</Text>
            </View>
            <Text style={styles.mainStatValue}>{Math.round(stats.averageSpeed)} km/h</Text>
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas Detalhadas</Text>
          
          <View style={styles.detailStatsGrid}>
            <View style={styles.detailStatCard}>
              <Text style={styles.detailStatLabel}>Velocidade Máxima</Text>
              <Text style={styles.detailStatValue}>{Math.round(stats.maxSpeed)} km/h</Text>
            </View>

            <View style={styles.detailStatCard}>
              <Text style={styles.detailStatLabel}>Tempo Total</Text>
              <Text style={styles.detailStatValue}>{formatTime(stats.totalTime)}</Text>
            </View>

            <View style={styles.detailStatCard}>
              <Text style={styles.detailStatLabel}>Pontos Coletados</Text>
              <Text style={styles.detailStatValue}>{stats.pointsCollected}</Text>
            </View>

            <View style={styles.detailStatCard}>
              <Text style={styles.detailStatLabel}>Precisão Média</Text>
              <Text style={styles.detailStatValue}>
                {stats.averageAccuracy > 0 ? `${Math.round(stats.averageAccuracy)}m` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/gps-map')}
            >
              <MapPin size={20} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Ver no Mapa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/gps-settings')}
            >
              <BarChart3 size={20} color="#2196F3" />
              <Text style={styles.actionButtonText}>Configurações</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Info */}
        {locationHistory.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Calendar size={20} color="#9C27B0" />
              <Text style={styles.summaryTitle}>Resumo do Período</Text>
            </View>
            
            <Text style={styles.summaryText}>
              Período selecionado: <Text style={styles.summaryHighlight}>{periods.find(p => p.key === selectedPeriod)?.label}</Text>
            </Text>
            <Text style={styles.summaryText}>
              Primeira localização: <Text style={styles.summaryHighlight}>
                {new Date(getFilteredLocations()[getFilteredLocations().length - 1]?.timestamp || 0).toLocaleDateString('pt-BR')}
              </Text>
            </Text>
            <Text style={styles.summaryText}>
              Última localização: <Text style={styles.summaryHighlight}>
                {new Date(getFilteredLocations()[0]?.timestamp || 0).toLocaleDateString('pt-BR')}
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: '#4CAF50',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  selectedPeriodButtonText: {
    color: '#fff',
  },
  mainStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  mainStatCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  mainStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mainStatLabel: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  detailStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 6,
  },
  detailStatValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  summaryText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  summaryHighlight: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});