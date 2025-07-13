import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from '@/lib/trpc';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import AnimatedBackground from '@/components/AnimatedBackground';
import LoadingScreen from '@/components/LoadingScreen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayoutNav() {
  const [isReady, setIsReady] = useState(false);
  const { initialize } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize auth store
        await initialize();
        
        // Add a small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [initialize]);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <View style={{ flex: 1 }}>
        <AnimatedBackground />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
              color: Colors.text,
            },
            contentStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleAlign: 'center',
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen 
            name="routes/[id]" 
            options={{ 
              title: "Detalhes da Rota",
              presentation: 'card',
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="rest-places/[id]" 
            options={{ 
              title: "Local de Descanso",
              presentation: 'card',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="community/[id]" 
            options={{ 
              title: "Comunidade",
              presentation: 'card',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="events/[id]" 
            options={{ 
              title: "Evento",
              presentation: 'card',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="chat/[id]" 
            options={{ 
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="search" 
            options={{ 
              title: "Buscar Usuários",
              presentation: 'modal',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="edit-profile" 
            options={{ 
              title: "Editar Perfil",
              presentation: 'modal',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="create-community" 
            options={{ 
              title: "Criar Comunidade",
              presentation: 'modal',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="create-event" 
            options={{ 
              title: "Criar Evento",
              presentation: 'modal',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="gps-settings" 
            options={{ 
              title: "Configurações GPS",
              presentation: 'card',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="gps-map" 
            options={{ 
              title: "Mapa GPS",
              presentation: 'card',
              headerTintColor: Colors.primary,
            }} 
          />
          <Stack.Screen 
            name="gps-stats" 
            options={{ 
              title: "Estatísticas GPS",
              presentation: 'card',
              headerTintColor: Colors.primary,
            }} 
          />
        </Stack>
      </View>
    </>
  );
}

export default function RootLayout() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}