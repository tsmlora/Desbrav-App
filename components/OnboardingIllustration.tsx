import React from 'react'
import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '@/constants/colors'

interface OnboardingIllustrationProps {
  children: React.ReactNode
}

export default function OnboardingIllustration({ children }: OnboardingIllustrationProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.card, Colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.innerContainer}>
          <LinearGradient
            colors={[Colors.primary + '10', Colors.primaryLight + '05']}
            style={styles.iconBackground}
          >
            <View style={styles.iconContainer}>
              {children}
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  iconBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.card,
    borderRadius: 30,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})