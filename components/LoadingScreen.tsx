import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '@/constants/colors'
import Logo from '@/components/Logo'

const { width, height } = Dimensions.get('window')

export default function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()

    // Continuous rotation for loading indicator
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    )
    rotateAnimation.start()

    return () => {
      rotateAnimation.stop()
    }
  }, [fadeAnim, scaleAnim, rotateAnim])

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary]}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Logo size="large" />
          
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[
                styles.loadingRing,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <View style={styles.loadingDot} />
            </Animated.View>
          </View>

          <Text style={styles.loadingText}>Carregando...</Text>
          <Text style={styles.subtitle}>Preparando sua aventura</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  loadingRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: Colors.border,
    borderTopColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: -4,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
})