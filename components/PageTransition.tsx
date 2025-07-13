import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'

interface PageTransitionProps {
  children: React.ReactNode
  duration?: number
}

export default function PageTransition({ children, duration = 600 }: PageTransitionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: duration * 0.8,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, slideAnim, scaleAnim, duration])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})