import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import LoadingScreen from '@/components/LoadingScreen'

export default function IndexScreen() {
  const { user, isFirstTime, loading, initialize } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initialize()
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeApp()
  }, [initialize])

  useEffect(() => {
    if (isInitialized && !loading) {
      // Add a small delay to ensure state is fully settled
      const timer = setTimeout(() => {
        if (!user) {
          // User not logged in, go to login
          router.replace('/auth/login')
        } else if (isFirstTime) {
          // User logged in but first time, show onboarding
          router.replace('/onboarding')
        } else {
          // User logged in and has seen onboarding, go to main app
          router.replace('/(tabs)')
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [user, isFirstTime, loading, isInitialized])

  return <LoadingScreen />
}