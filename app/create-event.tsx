import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, FileText, MapPin, Users, Image as ImageIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function CreateEventScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    organizer: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'Título do evento é obrigatório');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erro', 'Descrição é obrigatória');
      return;
    }
    if (!formData.date.trim()) {
      Alert.alert('Erro', 'Data é obrigatória');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Erro', 'Local é obrigatório');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      Alert.alert('Sucesso', 'Evento criado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Calendar size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Título do Evento</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              placeholder="Ex: Encontro de Motociclistas da Serra"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <FileText size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              placeholder="Descreva o evento, atividades planejadas..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Calendar size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Data</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(value) => updateFormData('date', value)}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <MapPin size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Local</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => updateFormData('location', value)}
              placeholder="Ex: Urubici, SC"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Users size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Organizador</Text>
            <TextInput
              style={styles.input}
              value={formData.organizer}
              onChangeText={(value) => updateFormData('organizer', value)}
              placeholder="Nome da comunidade ou organizador"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <ImageIcon size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>URL da Imagem (opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.image}
              onChangeText={(value) => updateFormData('image', value)}
              placeholder="https://exemplo.com/imagem.jpg"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.createButton, isLoading && styles.disabledButton]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? 'Criando...' : 'Criar Evento'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    color: Colors.text,
    fontSize: 16,
    padding: 0,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  createButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});