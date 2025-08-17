import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import LoadingScreen from '@/components/LoadingScreen'
import Colors from '@/constants/colors'

export default function IndexScreen() {
  const { user, isFirstTime, loading, initialize } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [backendStatus, setBackendStatus] = useState<string>('Checking...')

  // Test backend connectivity
  const testBackend = async () => {
    try {
      console.log('Testing backend connectivity...')
      const response = await fetch('https://4xdihzka1v67yzbxj8qvn.rork.com/api/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Backend response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Backend response data:', data)
        setBackendStatus(`✅ Backend OK: ${data.message}`)
      } else {
        const text = await response.text()
        console.error('Backend error response:', text)
        setBackendStatus(`❌ Backend Error: ${response.status}`)
      }
    } catch (error) {
      console.error('Backend test error:', error)
      setBackendStatus(`❌ Connection Error: ${error.message}`)
    }
  }

  // Test tRPC endpoint
  const testTRPC = async () => {
    try {
      console.log('Testing tRPC endpoint...')
      const response = await fetch('https://4xdihzka1v67yzbxj8qvn.rork.com/api/trpc/example.hi', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('tRPC response status:', response.status)
      const text = await response.text()
      console.log('tRPC response:', text)
      
      Alert.alert('tRPC Test', `Status: ${response.status}\nResponse: ${text}`)
    } catch (error) {
      console.error('tRPC test error:', error)
      Alert.alert('tRPC Error', error.message)
    }
  }

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test backend first
        await testBackend()
        
        // Then initialize auth
        await initialize()
      } catch (error) {
        console.error('Error initializing app:', error)
        setBackendStatus(`❌ Init Error: ${error.message}`)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeApp()
  }, [initialize])

  useEffect(() => {
    if (isInitialized && !loading && !showDebug) {
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
      }, 2000) // Increased delay to see debug info

      return () => clearTimeout(timer)
    }
  }, [user, isFirstTime, loading, isInitialized, showDebug])

  if (!isInitialized || loading) {
    return <LoadingScreen />
  }

  if (showDebug) {
    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>🔧 Debug Mode</Text>
        
        <View style={styles.debugSection}>
          <Text style={styles.debugLabel}>Backend Status:</Text>
          <Text style={styles.debugValue}>{backendStatus}</Text>
        </View>
        
        <View style={styles.debugSection}>
          <Text style={styles.debugLabel}>User:</Text>
          <Text style={styles.debugValue}>{user ? `✅ ${user.email}` : '❌ Not logged in'}</Text>
        </View>
        
        <View style={styles.debugSection}>
          <Text style={styles.debugLabel}>First Time:</Text>
          <Text style={styles.debugValue}>{isFirstTime ? '✅ Yes' : '❌ No'}</Text>
        </View>
        
        <TouchableOpacity style={styles.debugButton} onPress={testTRPC}>
          <Text style={styles.debugButtonText}>Test tRPC</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.debugButton} onPress={testBackend}>
          <Text style={styles.debugButtonText}>Test Backend</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.debugButton, styles.continueButton]} 
          onPress={() => setShowDebug(false)}
        >
          <Text style={styles.debugButtonText}>Continue to App</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Show debug option for a few seconds
  return (
    <View style={styles.container}>
      <LoadingScreen />
      <TouchableOpacity 
        style={styles.debugToggle} 
        onPress={() => setShowDebug(true)}
      >
        <Text style={styles.debugToggleText}>🔧</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  debugToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  debugToggleText: {
    fontSize: 20,
  },
  debugContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 60,
  },
  debugTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  debugSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
  },
  debugLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  debugValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  debugButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: Colors.success,
    marginTop: 20,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})