import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { LinearGradient } from 'expo-linear-gradient'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native'
import Colors from '@/constants/colors'
import Logo from '@/components/Logo'
import PageTransition from '@/components/PageTransition'

export default function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signUp, loading } = useAuthStore()

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }

    const success = await signUp(email, password, name)
    if (success) {
      router.replace('/auth/login')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF7F0']}
        style={styles.gradient}
      >
        <PageTransition>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center' }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.logoOverlay}>
                <Logo size="large" />
              </View>
            </View>

            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Criar conta</Text>
                <Text style={styles.subtitle}>Junte-se à comunidade de aventureiros</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <User size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nome completo"
                    placeholderTextColor={Colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Mail size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor={Colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={Colors.textMuted} />
                    ) : (
                      <Eye size={20} color={Colors.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar senha"
                    placeholderTextColor={Colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={Colors.textMuted} />
                    ) : (
                      <Eye size={20} color={Colors.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryLight]}
                    style={styles.registerButtonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.textLight} />
                    ) : (
                      <Text style={styles.registerButtonText}>Criar conta</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Já tem uma conta? </Text>
                  <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text style={styles.linkText}>Entrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        </PageTransition>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    height: 200,
    position: 'relative',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoOverlay: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
})