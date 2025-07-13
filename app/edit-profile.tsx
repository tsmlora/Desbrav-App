import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, FileText, Bike, MapPin } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, loading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    motorcycle: '',
    location: '',
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      console.log('Loading user data into form:', user);
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        motorcycle: user.motorcycle || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    try {
      console.log('Saving profile data:', formData);
      
      // Prepare clean data for update
      const updateData = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        motorcycle: formData.motorcycle.trim(),
        location: formData.location.trim(),
      };

      console.log('Clean update data:', updateData);
      
      const success = await updateProfile(updateData);

      if (success) {
        console.log('Profile updated successfully, navigating back');
        router.back();
      } else {
        console.log('Profile update failed');
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert('Erro', 'Erro inesperado ao salvar perfil');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Usuário não encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <User size={20} color={Colors.textSecondary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Seu nome completo"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <FileText size={20} color={Colors.textSecondary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.bio}
              onChangeText={(value) => updateFormData('bio', value)}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Bike size={20} color={Colors.textSecondary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Motocicleta</Text>
            <TextInput
              style={styles.input}
              value={formData.motorcycle}
              onChangeText={(value) => updateFormData('motorcycle', value)}
              placeholder="Ex: BMW R 1250 GS Adventure"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <MapPin size={20} color={Colors.textSecondary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Localização</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => updateFormData('location', value)}
              placeholder="Ex: São Paulo, SP"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            * Campos obrigatórios
          </Text>
          <Text style={styles.infoText}>
            Seus dados são salvos automaticamente no seu perfil.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    color: Colors.text,
    fontSize: 16,
    padding: 0,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  errorText: {
    color: Colors.accent,
    fontSize: 16,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
});