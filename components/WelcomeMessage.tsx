import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { CheckCircle, X, Sparkles } from 'lucide-react-native'
import Colors from '@/constants/colors'
import Logo from '@/components/Logo'

const { width, height } = Dimensions.get('window')

interface WelcomeMessageProps {
  visible: boolean
  onClose: () => void
  userName?: string
}

export default function WelcomeMessage({ visible, onClose, userName }: WelcomeMessageProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setShowContent(true), 400)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [visible])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.gradient}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={Colors.textLight} />
          </TouchableOpacity>

          {showContent && (
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.iconGradient}
                >
                  <CheckCircle size={50} color={Colors.textLight} />
                </LinearGradient>
              </View>

              <View style={styles.logoContainer}>
                <Logo size="large" color={Colors.textLight} />
                <View style={styles.sparkleContainer}>
                  <Sparkles size={16} color={Colors.textLight} />
                </View>
              </View>

              <Text style={styles.title}>
                Bem-vindo{userName ? `, ${userName}` : ''}!
              </Text>

              <Text style={styles.subtitle}>
                Sua jornada épica começa agora! Explore rotas incríveis, 
                conecte-se com aventureiros e conquiste medalhas exclusivas.
              </Text>

              <View style={styles.features}>
                <View style={styles.feature}>
                  <Text style={styles.featureIcon}>🗺️</Text>
                  <Text style={styles.featureText}>Rotas Personalizadas</Text>
                </View>
                <View style={styles.feature}>
                  <Text style={styles.featureIcon}>🏆</Text>
                  <Text style={styles.featureText}>Sistema de Conquistas</Text>
                </View>
                <View style={styles.feature}>
                  <Text style={styles.featureIcon}>👥</Text>
                  <Text style={styles.featureText}>Comunidade Ativa</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.startButton} onPress={onClose}>
                <LinearGradient
                  colors={[Colors.textLight, 'rgba(255, 255, 255, 0.9)']}
                  style={styles.startButtonGradient}
                >
                  <Text style={styles.startButtonText}>Começar Aventura</Text>
                  <Sparkles size={16} color={Colors.primary} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: width * 0.85,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    borderRadius: 40,
    padding: 20,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.9,
  },
  startButton: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
})