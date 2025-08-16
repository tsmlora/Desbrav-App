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
  Image,
} from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { LinearGradient } from 'expo-linear-gradient'
import { Eye, EyeOff, Mail, Lock, Settings } from 'lucide-react-native'
import Colors from '@/constants/colors'
import Logo from '@/components/Logo'
import PageTransition from '@/components/PageTransition'
import { trpc } from '@/lib/trpc'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [devSetupLoading, setDevSetupLoading] = useState(false)
  const { signIn, loading, error, clearError } = useAuthStore()

  const handleLogin = async () => {
    if (!email || !password) {
      return
    }

    // Clear any previous errors
    clearError()
    
    const success = await signIn(email, password)
    if (success) {
      // Let the index.tsx handle the routing based on isFirstTime
      router.replace('/')
    }
  }

  // Clear error when user starts typing
  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (error) clearError()
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text)
    if (error) clearError()
  }

  const handleDevSetup = async () => {
    setDevSetupLoading(true)
    clearError()
    
    try {
      const result = await trpc.auth.devSetup.mutate()
      if (result.success) {
        // Auto-fill the form with dev credentials
        setEmail(result.credentials.email)
        setPassword(result.credentials.password)
        
        // Auto-login
        const success = await signIn(result.credentials.email, result.credentials.password)
        if (success) {
          router.replace('/')
        }
      }
    } catch (error: any) {
      console.error('Dev setup error:', error)
    } finally {
      setDevSetupLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        <PageTransition>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Image
                source={{ uri: 'https://img.freepik.com/fotos-gratis/homem-de-vista-frontal-andando-de-moto_23-2150819748.jpg?semt=ais_hybrid&w=740' }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.logoOverlay}>
                <Logo size="large" />
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.header}>
                <Text style={styles.title}>Bem-vindo de volta</Text>
                <Text style={styles.subtitle}>Entre na sua conta e continue sua jornada</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Mail size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.textMuted}
                    value={email}
                    onChangeText={handleEmailChange}
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
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
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

                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryLight]}
                    style={styles.loginButtonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.textLight} />
                    ) : (
                      <Text style={styles.loginButtonText}>Entrar</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Dev Setup Button */}
                <TouchableOpacity
                  style={styles.devButton}
                  onPress={handleDevSetup}
                  disabled={devSetupLoading}
                >
                  <Settings size={16} color={Colors.textMuted} />
                  <Text style={styles.devButtonText}>
                    {devSetupLoading ? 'Configurando...' : 'Login de Desenvolvimento'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Não tem uma conta? </Text>
                  <TouchableOpacity onPress={() => router.push('/auth/register')}>
                    <Text style={styles.linkText}>Cadastre-se</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
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
  content: {
    flex: 1,
  },
  heroSection: {
    height: '40%',
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
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    gap: 20,
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
  loginButton: {
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
  loginButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
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
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '500',
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  devButtonText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
})