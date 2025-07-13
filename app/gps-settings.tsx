import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { 
  MapPin, 
  Settings, 
  Wifi, 
  WifiOff, 
  Clock, 
  Navigation,
  Trash2,
  RefreshCw,
  Battery,
  Zap
} from 'lucide-react-native';
import { useGPS } from '@/hooks/useGPS';

const GPS_ACCURACY_OPTIONS = [
  { 
    value: Location.LocationAccuracy.Lowest, 
    label: 'Baixa (Economia de bateria)', 
    description: 'Precisão de ~3km',
    icon: Battery
  },
  { 
    value: Location.LocationAccuracy.Low, 
    label: 'Baixa-Média', 
    description: 'Precisão de ~1km',
    icon: Battery
  },
  { 
    value: Location.LocationAccuracy.Balanced, 
    label: 'Balanceada (Recomendado)', 
    description: 'Precisão de ~100m',
    icon: Zap
  },
  { 
    value: Location.LocationAccuracy.High, 
    label: 'Alta', 
    description: 'Precisão de ~10m',
    icon: Navigation
  },
  { 
    value: Location.LocationAccuracy.Highest, 
    label: 'Máxima (Consome mais bateria)', 
    description: 'Precisão de ~3m',
    icon: Zap
  },
];

const TIME_INTERVAL_OPTIONS = [
  { value: 1000, label: '1 segundo' },
  { value: 5000, label: '5 segundos (Recomendado)' },
  { value: 10000, label: '10 segundos' },
  { value: 30000, label: '30 segundos' },
  { value: 60000, label: '1 minuto' },
];

const DISTANCE_INTERVAL_OPTIONS = [
  { value: 1, label: '1 metro' },
  { value: 5, label: '5 metros' },
  { value: 10, label: '10 metros (Recomendado)' },
  { value: 25, label: '25 metros' },
  { value: 50, label: '50 metros' },
];

export default function GPSSettingsScreen() {
  const {
    isTracking,
    settings,
    offlineQueueSize,
    lastSyncTime,
    error,
    isLoading,
    startTracking,
    stopTracking,
    updateSettings,
    syncOfflineData,
    clearLocationHistory,
    clearError,
    refreshStatus,
  } = useGPS();

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    refreshStatus();
  }, []);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

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

  const handleUpdateSettings = async () => {
    const success = await updateSettings(localSettings);
    if (success) {
      Alert.alert('Sucesso', 'Configurações atualizadas com sucesso!');
    }
  };

  const handleSyncOfflineData = async () => {
    if (offlineQueueSize === 0) {
      Alert.alert('Info', 'Não há dados offline para sincronizar.');
      return;
    }

    Alert.alert(
      'Sincronizar Dados',
      `Sincronizar ${offlineQueueSize} localizações offline?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sincronizar', 
          onPress: async () => {
            const success = await syncOfflineData();
            if (success) {
              Alert.alert('Sucesso', 'Dados sincronizados com sucesso!');
            }
          }
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja limpar todo o histórico de localização? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: async () => {
            const success = await clearLocationHistory();
            if (success) {
              Alert.alert('Sucesso', 'Histórico limpo com sucesso!');
            }
          }
        },
      ]
    );
  };

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Nunca';
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Configurações GPS',
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError} style={styles.errorButton}>
              <Text style={styles.errorButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Status do Rastreamento</Text>
          </View>
          
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Rastreamento Ativo</Text>
              <View style={styles.switchContainer}>
                {isLoading && <ActivityIndicator size="small" color="#4CAF50" />}
                <Switch
                  value={isTracking}
                  onValueChange={handleToggleTracking}
                  trackColor={{ false: '#333', true: '#4CAF50' }}
                  thumbColor={isTracking ? '#fff' : '#666'}
                  disabled={isLoading}
                />
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Dados Offline</Text>
              <View style={styles.statusValue}>
                {offlineQueueSize > 0 ? (
                  <WifiOff size={16} color="#FF9800" />
                ) : (
                  <Wifi size={16} color="#4CAF50" />
                )}
                <Text style={styles.statusText}>{offlineQueueSize} localizações</Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Última Sincronização</Text>
              <Text style={styles.statusText}>{formatLastSync(lastSyncTime)}</Text>
            </View>
          </View>
        </View>

        {/* Accuracy Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Navigation size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>Precisão</Text>
          </View>
          
          {GPS_ACCURACY_OPTIONS.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  localSettings.accuracy === option.value && styles.selectedOption
                ]}
                onPress={() => setLocalSettings({ ...localSettings, accuracy: option.value })}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionHeader}>
                    <IconComponent size={16} color={localSettings.accuracy === option.value ? '#4CAF50' : '#666'} />
                    <Text style={[
                      styles.optionTitle,
                      localSettings.accuracy === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  localSettings.accuracy === option.value && styles.radioButtonSelected
                ]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Time Interval Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#FF9800" />
            <Text style={styles.sectionTitle}>Intervalo de Tempo</Text>
          </View>
          
          {TIME_INTERVAL_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                localSettings.timeInterval === option.value && styles.selectedOption
              ]}
              onPress={() => setLocalSettings({ ...localSettings, timeInterval: option.value })}
            >
              <Text style={[
                styles.optionTitle,
                localSettings.timeInterval === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
              <View style={[
                styles.radioButton,
                localSettings.timeInterval === option.value && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Distance Interval Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Intervalo de Distância</Text>
          </View>
          
          {DISTANCE_INTERVAL_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                localSettings.distanceInterval === option.value && styles.selectedOption
              ]}
              onPress={() => setLocalSettings({ ...localSettings, distanceInterval: option.value })}
            >
              <Text style={[
                styles.optionTitle,
                localSettings.distanceInterval === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
              <View style={[
                styles.radioButton,
                localSettings.distanceInterval === option.value && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Background Tracking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color="#607D8B" />
            <Text style={styles.sectionTitle}>Configurações Avançadas</Text>
          </View>
          
          <View style={styles.optionCard}>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Rastreamento em Segundo Plano</Text>
              <Text style={styles.optionDescription}>
                Continuar rastreando quando o app estiver fechado
              </Text>
            </View>
            <Switch
              value={localSettings.enableBackground}
              onValueChange={(value) => setLocalSettings({ ...localSettings, enableBackground: value })}
              trackColor={{ false: '#333', true: '#4CAF50' }}
              thumbColor={localSettings.enableBackground ? '#fff' : '#666'}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleUpdateSettings}
            disabled={isLoading}
          >
            <Settings size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Salvar Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleSyncOfflineData}
            disabled={offlineQueueSize === 0}
          >
            <RefreshCw size={20} color={offlineQueueSize === 0 ? '#666' : '#4CAF50'} />
            <Text style={[
              styles.secondaryButtonText,
              offlineQueueSize === 0 && styles.disabledButtonText
            ]}>
              Sincronizar Dados Offline ({offlineQueueSize})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dangerButton} 
            onPress={handleClearHistory}
          >
            <Trash2 size={20} color="#fff" />
            <Text style={styles.dangerButtonText}>Limpar Histórico</Text>
          </TouchableOpacity>
        </View>
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
  errorContainer: {
    backgroundColor: '#FF5252',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  statusCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    color: '#fff',
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#ccc',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#4CAF50',
  },
  optionDescription: {
    fontSize: 14,
    color: '#999',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
  },
  radioButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#666',
  },
  dangerButton: {
    backgroundColor: '#FF5252',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});