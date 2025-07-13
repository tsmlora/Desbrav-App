import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, FileText, MapPin, Image as ImageIcon, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/colors';

export default function CreateCommunityScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    region: '',
    image: '',
  });
  
  const utils = trpc.useUtils();
  
  const createCommunityMutation = trpc.communities.create.useMutation({
    onSuccess: () => {
      // Invalidate communities list to refresh the data
      utils.communities.list.invalidate();
      
      Alert.alert(
        'Sucesso!',
        'Comunidade criada com sucesso!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.message || 'Erro ao criar comunidade');
    },
  });

  const handleCreate = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome da comunidade é obrigatório');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erro', 'Descrição é obrigatória');
      return;
    }
    if (!formData.region.trim()) {
      Alert.alert('Erro', 'Região é obrigatória');
      return;
    }

    createCommunityMutation.mutate({
      name: formData.name.trim(),
      description: formData.description.trim(),
      region: formData.region.trim(),
      image_url: formData.image.trim() || undefined,
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // For web, just use URL input
      Alert.alert(
        'Adicionar Imagem',
        'Cole a URL da imagem abaixo:',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'OK',
            onPress: () => {
              // This would need a proper input dialog, for now just use the text input
            }
          }
        ]
      );
      return;
    }

    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Erro', 'Permissão para acessar a galeria é necessária!');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateFormData('image', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar imagem');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Aviso', 'Câmera não disponível na versão web');
      return;
    }

    try {
      // Request permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Erro', 'Permissão para acessar a câmera é necessária!');
        return;
      }

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateFormData('image', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tirar foto');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Adicionar Imagem',
      'Escolha uma opção:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galeria', onPress: pickImage },
        { text: 'Câmera', onPress: takePhoto },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Users size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nome da Comunidade</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Ex: Motociclistas de São Paulo"
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
              placeholder="Descreva o propósito da sua comunidade..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <MapPin size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Região</Text>
            <TextInput
              style={styles.input}
              value={formData.region}
              onChangeText={(value) => updateFormData('region', value)}
              placeholder="Ex: Sudeste, Nacional, São Paulo"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <ImageIcon size={20} color={Colors.primary} />
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Imagem da Comunidade</Text>
            
            {formData.image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={showImageOptions}
                >
                  <Text style={styles.changeImageText}>Alterar Imagem</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={showImageOptions}
              >
                <Camera size={24} color={Colors.primary} />
                <Text style={styles.addImageText}>Adicionar Imagem</Text>
              </TouchableOpacity>
            )}
            
            <Text style={styles.orText}>ou</Text>
            
            <TextInput
              style={styles.input}
              value={formData.image}
              onChangeText={(value) => updateFormData('image', value)}
              placeholder="Cole a URL da imagem aqui"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.createButton, createCommunityMutation.isPending && styles.disabledButton]}
          onPress={handleCreate}
          disabled={createCommunityMutation.isPending}
        >
          {createCommunityMutation.isPending && (
            <ActivityIndicator size="small" color={Colors.background} style={{ marginRight: 8 }} />
          )}
          <Text style={styles.createButtonText}>
            {createCommunityMutation.isPending ? 'Criando...' : 'Criar Comunidade'}
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
  imagePreviewContainer: {
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: Colors.cardDark,
    marginBottom: 8,
  },
  changeImageButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  changeImageText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardDark,
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  addImageText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'center',
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