import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { 
  MapPin, 
  Users, 
  Trophy, 
  MessageCircle, 
  Navigation,
  ArrowRight,
  ArrowLeft,
  Compass,
  Star
} from 'lucide-react-native'
import Colors from '@/constants/colors'
import Logo from '@/components/Logo'
import OnboardingIllustration from '@/components/OnboardingIllustration'
import PageTransition from '@/components/PageTransition'
import { useAuthStore } from '@/store/authStore'

const { width, height } = Dimensions.get('window')

interface OnboardingSlide {
  id: number
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  illustration: string
  gradient: string[]
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Explore Rotas Épicas',
    subtitle: 'Aventuras Personalizadas',
    description: 'Descubra trilhas incríveis adaptadas ao seu nível. Cada jornada é uma nova aventura esperando por você.',
    icon: <Navigation size={50} color={Colors.primary} />,
    illustration: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop&crop=center',
    gradient: [Colors.primary + '15', Colors.primaryLight + '08']
  },
  {
    id: 2,
    title: 'Pontos Estratégicos',
    subtitle: 'Descanso & Reabastecimento',
    description: 'Encontre os melhores locais para pausas, alimentação e recarregar suas energias durante a aventura.',
    icon: <MapPin size={50} color={Colors.primary} />,
    illustration: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop&crop=center',
    gradient: [Colors.secondary + '15', Colors.primary + '08']
  },
  {
    id: 3,
    title: 'Sistema de Conquistas',
    subtitle: 'Medalhas & Desafios',
    description: 'Complete missões épicas, desbloqueie conquistas exclusivas e colecione medalhas que celebram seu progresso.',
    icon: <Trophy size={50} color={Colors.primary} />,
    illustration: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=400&fit=crop&crop=center',
    gradient: [Colors.warning + '15', Colors.primary + '08']
  },
  {
    id: 4,
    title: 'Comunidade Ativa',
    subtitle: 'Conecte-se & Compartilhe',
    description: 'Junte-se a grupos, participe de eventos exclusivos e faça parte de uma comunidade apaixonada por aventuras.',
    icon: <Users size={50} color={Colors.primary} />,
    illustration: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=400&fit=crop&crop=center',
    gradient: [Colors.info + '15', Colors.primary + '08']
  },
  {
    id: 5,
    title: 'Chat & Experiências',
    subtitle: 'Troque Dicas & Histórias',
    description: 'Compartilhe suas aventuras, troque dicas valiosas e mantenha contato com outros exploradores.',
    icon: <MessageCircle size={50} color={Colors.primary} />,
    illustration: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=400&fit=crop&crop=center',
    gradient: [Colors.success + '15', Colors.primary + '08']
  }
]

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const { setFirstTimeComplete, user } = useAuthStore()

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const nextIndex = currentSlide + 1
      setCurrentSlide(nextIndex)
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true
      })
    } else {
      completeOnboarding()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      const prevIndex = currentSlide - 1
      setCurrentSlide(prevIndex)
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true
      })
    }
  }

  const completeOnboarding = async () => {
    if (isCompleting) return
    
    setIsCompleting(true)
    try {
      setFirstTimeComplete()
      
      setTimeout(() => {
        router.replace('/(tabs)')
      }, 500)
    } catch (error) {
      console.error('Error completing onboarding:', error)
      Alert.alert('Erro', 'Erro ao finalizar apresentação. Tente novamente.')
      setIsCompleting(false)
    }
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        <PageTransition>
          {/* Header */}
          <View style={styles.header}>
            <Logo size="medium" />
            <TouchableOpacity 
              onPress={skipOnboarding} 
              style={styles.skipButton}
              disabled={isCompleting}
            >
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentSlide + 1) / slides.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentSlide + 1} de {slides.length}
            </Text>
          </View>

          {/* Slides */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width)
              setCurrentSlide(slideIndex)
            }}
            style={styles.scrollView}
            scrollEnabled={!isCompleting}
          >
            {slides.map((slide, index) => (
              <View key={slide.id} style={styles.slide}>
                <View style={styles.slideContent}>
                  {/* Illustration */}
                  <View style={styles.illustrationContainer}>
                    <LinearGradient
                      colors={slide.gradient}
                      style={styles.illustrationGradient}
                    >
                      <Image
                        source={{ uri: slide.illustration }}
                        style={styles.illustration}
                        resizeMode="cover"
                      />
                      <View style={styles.illustrationOverlay} />
                    </LinearGradient>
                    
                    <View style={styles.iconContainer}>
                      <OnboardingIllustration>
                        {slide.icon}
                      </OnboardingIllustration>
                    </View>
                  </View>
                  
                  {/* Content */}
                  <View style={styles.textContent}>
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.description}>{slide.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => goToSlide(index)}
                style={[
                  styles.dot,
                  index === currentSlide ? styles.activeDot : styles.inactiveDot
                ]}
                disabled={isCompleting}
              />
            ))}
          </View>

          {/* Navigation */}
          <View style={styles.navigation}>
            <TouchableOpacity
              onPress={prevSlide}
              style={[
                styles.navButton, 
                (currentSlide === 0 || isCompleting) && styles.navButtonDisabled
              ]}
              disabled={currentSlide === 0 || isCompleting}
            >
              <ArrowLeft 
                size={20} 
                color={(currentSlide === 0 || isCompleting) ? Colors.textMuted : Colors.text} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={nextSlide} 
              style={styles.nextButton}
              disabled={isCompleting}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={[
                  styles.nextButtonGradient,
                  isCompleting && styles.nextButtonDisabled
                ]}
              >
                <Text style={styles.nextButtonText}>
                  {isCompleting 
                    ? 'Finalizando...' 
                    : currentSlide === slides.length - 1 
                      ? 'Começar Aventura' 
                      : 'Continuar'
                  }
                </Text>
                {!isCompleting && (
                  currentSlide === slides.length - 1 
                    ? <Star size={18} color={Colors.textLight} />
                    : <ArrowRight size={18} color={Colors.textLight} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: 24,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  illustrationGradient: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  illustration: {
    width: width * 0.75,
    height: 280,
  },
  illustrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    position: 'absolute',
    bottom: -40,
    alignItems: 'center',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: width * 0.85,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  dot: {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  },
  activeDot: {
    width: 32,
    height: 8,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.border,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navButtonDisabled: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
  },
  nextButton: {
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 16,
    gap: 8,
    minWidth: 140,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
})