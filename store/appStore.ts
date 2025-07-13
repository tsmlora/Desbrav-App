import { create } from 'zustand';
import { AppState, LocationState, Medal, User } from '@/types';
import { mockUser, mockMedals, mockCommunities, mockEvents } from '@/constants/mockData';
import { routes } from '@/constants/routes';
import { restPlaces } from '@/constants/restPlaces';

const initialLocationState: LocationState = {
  latitude: null,
  longitude: null,
  error: null,
  tracking: false
};

export const useAppStore = create<AppState>()((set, get) => ({
  user: mockUser,
  medals: mockMedals,
  routes: routes,
  restPlaces: restPlaces,
  communities: mockCommunities,
  events: mockEvents,
  location: initialLocationState,
}));

export const useLocationStore = create<{
  location: LocationState;
  setLocation: (latitude: number, longitude: number) => void;
  setError: (error: string) => void;
  startTracking: () => void;
  stopTracking: () => void;
}>((set, get) => ({
  location: initialLocationState,
  setLocation: (latitude, longitude) => {
    set({ location: { ...get().location, latitude, longitude, error: null } });
  },
  setError: (error) => 
    set({ location: { ...get().location, error } }),
  startTracking: () => 
    set({ location: { ...get().location, tracking: true } }),
  stopTracking: () => 
    set({ location: { ...get().location, tracking: false } }),
}));

// Manual medal checking function - to be called explicitly when needed
export const checkForMedals = (latitude: number, longitude: number) => {
  const { user, routes } = useAppStore.getState();
  
  if (!user) return;
  
  // Simple distance calculation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };
  
  let hasNewMedals = false;
  const newMedals: Medal[] = [];
  const newCompletedRoutes: string[] = [];
  
  routes.forEach(route => {
    // Check if user is near a route endpoint (within 1km) and hasn't completed it yet
    const distance = calculateDistance(
      latitude,
      longitude,
      route.coordinates.latitude,
      route.coordinates.longitude
    );
    
    if (distance <= 1 && !user.completedRoutes.includes(route.id)) {
      hasNewMedals = true;
      
      // Award medal
      const newMedal: Medal = {
        id: `earned-${route.id}-${Date.now()}`,
        name: route.medal.name,
        image: route.medal.image,
        description: route.medal.description,
        dateEarned: new Date().toISOString().split('T')[0],
        routeId: route.id
      };
      
      newMedals.push(newMedal);
      newCompletedRoutes.push(route.id);
    }
  });
  
  // Only update state if there are new medals to avoid unnecessary re-renders
  if (hasNewMedals) {
    const updatedUser = {
      ...user,
      medals: [...user.medals, ...newMedals],
      completedRoutes: [...user.completedRoutes, ...newCompletedRoutes]
    };
    
    useAppStore.setState({
      user: updatedUser
    });
  }
};