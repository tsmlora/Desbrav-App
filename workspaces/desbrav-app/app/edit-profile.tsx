import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/store/authStore';
import SafeArea from '@/components/SafeArea';

const EditProfile = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [motorcycle, setMotorcycle] = useState('');
  const [location, setLocation] = useState('');

  const profileQuery = trpc.users.getProfile.useQuery(undefined, {
    enabled: !!user,
    onError: (error) => {
      console.error('Error fetching profile:', error);
      Alert.alert('Erro', 'Erro ao buscar dados do perfil. Tente novamente.');
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name || '');
      setBio(profileQuery.data.bio || '');
      setMotorcycle(profileQuery.data.motorcycle || '');
      setLocation(profileQuery.data.location || '');
    }
  }, [profileQuery.data]);

  const updateProfileMutation = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!' );
      profileQuery.refetch();
      router.back();
    },
    onError: (error) => {
      console.error('Update profile error:', error);
      let errorMessage = 'Erro ao atualizar perfil. Tente novamente.';
      if (error.message) {
        errorMessage = `Erro ao atualizar perfil: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage = `Erro ao atualizar perfil: ${error}`;
      }
      Alert.alert('Erro', errorMessage);
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio.');
      return;
    }

    updateProfileMutation.mutate({
      name: name.trim(),
      bio: bio.trim(),
      motorcycle: motorcycle.trim(),
      location: location.trim(),
    });
  };

  return (
    <SafeArea>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome"
          />
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Fale sobre você"
            multiline
          />
          <Text style={styles.label}>Motocicleta</Text>
          <TextInput
            style={styles.input}
            value={motorcycle}
            onChangeText={setMotorcycle}
            placeholder="Modelo da sua moto"
          />
          <Text style={styles.label}>Localização</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Onde você está baseado?"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={updateProfileMutation.isLoading}
          >
            <Text style={styles.saveButtonText}>
              {updateProfileMutation.isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: Platform.OS === 'android' ? 'top' : 'auto',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
