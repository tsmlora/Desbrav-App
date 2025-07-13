import { Route } from '@/constants/routes';
import { RestPlace } from '@/constants/restPlaces';

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  motorcycle: string;
  location: string;
  medals: Medal[];
  friends: string[];
  completedRoutes: string[];
}

export interface Medal {
  id: string;
  name: string;
  image: string;
  description: string;
  dateEarned: string;
  routeId: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string;
  region: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  participants: string[];
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  tracking: boolean;
}

export interface AppState {
  user: User | null;
  medals: Medal[];
  routes: Route[];
  restPlaces: RestPlace[];
  communities: Community[];
  events: Event[];
  location: LocationState;
}