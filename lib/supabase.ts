import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const supabaseUrl = 'https://juiffgxububozvqzvhih.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aWZmZ3h1YnVib3p2cXp2aGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzI1NzUsImV4cCI6MjA2NzQwODU3NX0.jFiEFFw98GmRrNb09lApUmEYZ0JHnfP6SmE1mYzG9kw'

// Storage adapter for React Native
const storage = Platform.select({
  web: {
    getItem: (key: string) => {
      if (typeof localStorage === 'undefined') {
        return null
      }
      return localStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
      if (typeof localStorage === 'undefined') {
        return
      }
      localStorage.setItem(key, value)
    },
    removeItem: (key: string) => {
      if (typeof localStorage === 'undefined') {
        return
      }
      localStorage.removeItem(key)
    },
  },
  default: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
    removeItem: AsyncStorage.removeItem,
  },
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Types for our database
export interface User {
  id: string
  email: string
  name: string
  bio?: string
  motorcycle?: string
  location?: string
  avatar_url?: string
  onboarding_completed?: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
}

export interface Community {
  id: string
  name: string
  description: string
  image_url?: string
  creator_id: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  image_url?: string
  creator_id: string
  community_id?: string
  created_at: string
  updated_at: string
}