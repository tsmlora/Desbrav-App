import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase, User } from '@/lib/supabase'
import { Alert } from 'react-native'

interface AuthState {
  user: User | null
  session: any
  loading: boolean
  isFirstTime: boolean
  error: string | null
  initialized: boolean
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  initialize: () => Promise<void>
  setFirstTimeComplete: () => void
  clearError: () => void
  refreshProfile: () => Promise<void>
}

const getErrorMessage = (error: any): string => {
  console.log('Error object:', error)
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.message) {
    return error.message
  }
  
  if (error?.error_description) {
    return error.error_description
  }
  
  if (error?.details) {
    return error.details
  }

  if (error?.hint) {
    return error.hint
  }

  if (error?.code) {
    // Handle specific Supabase error codes
    switch (error.code) {
      case '23505':
        return 'Este email já está em uso'
      case '42501':
        return 'Permissão negada'
      case '42P01':
        return 'Tabela não encontrada'
      case 'PGRST116':
        return 'Perfil não encontrado'
      default:
        return `Erro do banco de dados (${error.code})`
    }
  }
  
  // Try to extract meaningful error info
  if (typeof error === 'object' && error !== null) {
    try {
      // Check if it's a PostgreSQL error
      if (error.severity && error.message) {
        return error.message
      }
      
      // Check for nested error
      if (error.error && typeof error.error === 'object') {
        return getErrorMessage(error.error)
      }
      
      // Last resort - stringify but make it readable
      const stringified = JSON.stringify(error, null, 2)
      if (stringified !== '{}') {
        return `Erro: ${stringified}`
      }
    } catch {
      // If JSON.stringify fails, return generic message
    }
  }
  
  return 'Erro inesperado ao processar solicitação'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      isFirstTime: true,
      error: null,
      initialized: false,

      initialize: async () => {
        if (get().initialized) return
        
        try {
          set({ loading: true })
          
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            // Get user profile from our users table
            const { data: profile, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile during init:', getErrorMessage(error))
            }

            const userData = profile || {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || 'Usuário',
              bio: '',
              motorcycle: '',
              location: '',
              avatar_url: '',
              onboarding_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }

            // Check if user has completed onboarding
            const hasCompletedOnboarding = profile?.onboarding_completed === true
            
            set({ 
              session, 
              user: userData,
              isFirstTime: !hasCompletedOnboarding,
              initialized: true,
              loading: false
            })
          } else {
            set({ 
              session: null, 
              user: null, 
              initialized: true,
              loading: false
            })
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              try {
                const { data: profile, error } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()

                if (error && error.code !== 'PGRST116') {
                  console.error('Error fetching profile on auth change:', getErrorMessage(error))
                }

                const userData = profile || {
                  id: session.user.id,
                  email: session.user.email!,
                  name: session.user.user_metadata?.name || 'Usuário',
                  bio: '',
                  motorcycle: '',
                  location: '',
                  avatar_url: '',
                  onboarding_completed: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }

                const hasCompletedOnboarding = profile?.onboarding_completed === true

                set({ 
                  session, 
                  user: userData,
                  isFirstTime: !hasCompletedOnboarding
                })
              } catch (error) {
                console.error('Error in auth state change:', getErrorMessage(error))
              }
            } else if (event === 'SIGNED_OUT') {
              set({ session: null, user: null, isFirstTime: true })
            }
          })
        } catch (error) {
          console.error('Error initializing auth:', getErrorMessage(error))
          set({ initialized: true, loading: false })
        }
      },

      refreshProfile: async () => {
        const { user, session } = get()
        if (!user || !session) {
          console.log('No user or session available for refresh')
          return
        }

        try {
          console.log('Refreshing profile for user:', user.id)
          
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) {
            const errorMessage = getErrorMessage(error)
            console.error('Error refreshing profile:', errorMessage)
            
            // Only show alert for non-404 errors
            if (error.code !== 'PGRST116') {
              Alert.alert('Erro', `Erro ao atualizar perfil: ${errorMessage}`)
            }
            return
          }

          if (profile) {
            console.log('Profile refreshed successfully:', profile)
            set({ user: profile })
          } else {
            console.log('No profile data returned')
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          console.error('Error refreshing profile (catch):', errorMessage)
          Alert.alert('Erro', `Erro inesperado ao atualizar perfil: ${errorMessage}`)
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        set({ loading: true, error: null })
        try {
          console.log('Starting signup process...')
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
              }
            }
          })

          if (error) {
            console.error('Auth signup error:', error)
            const errorMessage = getErrorMessage(error)
            set({ error: errorMessage })
            Alert.alert('Erro', errorMessage)
            return false
          }

          console.log('Auth signup successful:', data.user?.id)

          if (data.user) {
            console.log('User created successfully, creating profile...')
            
            // Wait a bit for the trigger to create the profile
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Create profile manually
            try {
              const profileData = {
                id: data.user.id,
                email: data.user.email!,
                name,
                bio: '',
                motorcycle: '',
                location: '',
                avatar_url: '',
                onboarding_completed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }

              console.log('Creating profile:', profileData)

              const { error: profileError } = await supabase
                .from('users')
                .upsert([profileData], { 
                  onConflict: 'id',
                  ignoreDuplicates: false 
                })

              if (profileError) {
                const errorMessage = getErrorMessage(profileError)
                console.error('Profile creation error:', errorMessage)
              } else {
                console.log('Profile created successfully')
              }
            } catch (profileError: any) {
              const errorMessage = getErrorMessage(profileError)
              console.error('Profile creation failed:', errorMessage)
            }

            Alert.alert('Sucesso', 'Conta criada com sucesso!')
            set({ isFirstTime: true, error: null })
            return true
          }

          return false
        } catch (error: any) {
          console.error('Signup catch error:', error)
          const errorMessage = getErrorMessage(error)
          set({ error: errorMessage })
          Alert.alert('Erro', errorMessage)
          return false
        } finally {
          set({ loading: false })
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            console.error('Login error:', error)
            let errorMessage = 'Usuário ou senha incorretos'
            
            // Check for specific error types
            if (error.message.includes('Invalid login credentials') || 
                error.message.includes('invalid_credentials') ||
                error.message.includes('Email not confirmed') ||
                error.message.includes('Invalid email or password')) {
              errorMessage = 'Usuário ou senha incorretos'
            } else {
              errorMessage = getErrorMessage(error)
            }
            
            set({ error: errorMessage })
            Alert.alert('Erro', errorMessage)
            return false
          }

          // Check if user has completed onboarding
          try {
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (profileError && profileError.code !== 'PGRST116') {
              const errorMessage = getErrorMessage(profileError)
              console.error('Error fetching profile after login:', errorMessage)
            }

            const hasCompletedOnboarding = profile?.onboarding_completed === true
            set({ isFirstTime: !hasCompletedOnboarding, error: null })
          } catch (profileError) {
            const errorMessage = getErrorMessage(profileError)
            console.error('Error checking onboarding status:', errorMessage)
            set({ isFirstTime: true, error: null })
          }
          
          return true
        } catch (error: any) {
          console.error('Login catch error:', error)
          const errorMessage = getErrorMessage(error)
          set({ error: errorMessage })
          Alert.alert('Erro', errorMessage)
          return false
        } finally {
          set({ loading: false })
        }
      },

      signOut: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, session: null, isFirstTime: true })
        } catch (error: any) {
          console.error('Logout error:', error)
          const errorMessage = getErrorMessage(error)
          Alert.alert('Erro', errorMessage)
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get()
        if (!user) {
          Alert.alert('Erro', 'Usuário não encontrado')
          return false
        }

        set({ loading: true })
        try {
          console.log('Updating profile for user:', user.id)
          console.log('Updates:', updates)

          // Prepare the update data
          const updatedData = {
            ...updates,
            updated_at: new Date().toISOString()
          }

          // Remove undefined values
          Object.keys(updatedData).forEach(key => {
            if (updatedData[key as keyof typeof updatedData] === undefined) {
              delete updatedData[key as keyof typeof updatedData]
            }
          })

          console.log('Final update data:', updatedData)

          const { data, error } = await supabase
            .from('users')
            .update(updatedData)
            .eq('id', user.id)
            .select()
            .single()

          if (error) {
            const errorMessage = getErrorMessage(error)
            console.error('Update profile error:', errorMessage)
            Alert.alert('Erro', `Erro ao atualizar perfil: ${errorMessage}`)
            return false
          }

          console.log('Profile updated successfully:', data)

          // Update local state with the returned data
          const updatedUser = { ...user, ...data }
          set({ user: updatedUser })
          
          Alert.alert('Sucesso', 'Perfil atualizado com sucesso!')
          return true
        } catch (error: any) {
          const errorMessage = getErrorMessage(error)
          console.error('Update profile catch error:', errorMessage)
          Alert.alert('Erro', `Erro inesperado ao atualizar perfil: ${errorMessage}`)
          return false
        } finally {
          set({ loading: false })
        }
      },

      setFirstTimeComplete: () => {
        set({ isFirstTime: false })
        // Update user profile to mark onboarding as completed
        const { user } = get()
        if (user) {
          supabase
            .from('users')
            .update({ onboarding_completed: true })
            .eq('id', user.id)
            .then(() => {
              console.log('Onboarding marked as completed')
            })
            .catch((error: any) => {
              const errorMessage = getErrorMessage(error)
              console.error('Error updating onboarding status:', errorMessage)
            })
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        session: state.session, 
        isFirstTime: state.isFirstTime 
      }),
    }
  )
)