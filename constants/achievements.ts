import { Achievement } from '@/types/achievements';

export const achievements: Achievement[] = [
  // Distance Achievements
  {
    id: 'first_100km',
    name: 'Primeiro Centenário',
    description: 'Complete 100km em uma única viagem',
    category: 'distance',
    criteria: { single_trip_distance: 100000 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 100,
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'distance_500km',
    name: 'Explorador Dedicado',
    description: 'Percorra 500km no total',
    category: 'distance',
    criteria: { total_distance: 500000 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 250,
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'distance_1000km',
    name: 'Milha de Ouro',
    description: 'Alcance 1000km percorridos',
    category: 'distance',
    criteria: { total_distance: 1000000 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 500,
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'distance_5000km',
    name: 'Lenda das Estradas',
    description: 'Conquiste 5000km de aventuras',
    category: 'distance',
    criteria: { total_distance: 5000000 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 2000,
    rarity: 'legendary',
    unlocked: false,
  },

  // Speed Achievements
  {
    id: 'safe_driver',
    name: 'Piloto Seguro',
    description: 'Mantenha velocidade entre 60-80 km/h por 30 minutos',
    category: 'speed',
    criteria: { 
      average_speed_min: 60, 
      average_speed_max: 80, 
      consistent_speed_duration: 30 
    },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 150,
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'consistency_master',
    name: 'Mestre da Consistência',
    description: 'Mantenha velocidade constante por 1 hora',
    category: 'speed',
    criteria: { consistent_speed_duration: 60 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 300,
    rarity: 'rare',
    unlocked: false,
  },

  // Exploration Achievements
  {
    id: 'city_explorer',
    name: 'Explorador Urbano',
    description: 'Visite 10 cidades diferentes',
    category: 'exploration',
    criteria: { cities_visited: 10 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 400,
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'route_master',
    name: 'Mestre das Rotas',
    description: 'Complete 5 rotas diferentes',
    category: 'exploration',
    criteria: { routes_completed: 5 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 600,
    rarity: 'epic',
    unlocked: false,
  },

  // Social Achievements
  {
    id: 'social_rider',
    name: 'Motociclista Social',
    description: 'Participe de 5 passeios em grupo',
    category: 'social',
    criteria: { group_rides: 5 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 200,
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'influencer',
    name: 'Influenciador das Estradas',
    description: 'Compartilhe 20 aventuras',
    category: 'social',
    criteria: { shares_count: 20 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 350,
    rarity: 'rare',
    unlocked: false,
  },

  // Time-based Achievements
  {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Faça 10 viagens pela manhã (6h-10h)',
    category: 'time',
    criteria: { time_of_day: 'morning' },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 150,
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'night_rider',
    name: 'Cavaleiro da Noite',
    description: 'Complete 5 viagens noturnas (20h-6h)',
    category: 'time',
    criteria: { time_of_day: 'night' },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 250,
    rarity: 'rare',
    unlocked: false,
  },

  // Streak Achievements
  {
    id: 'weekly_streak',
    name: 'Semana Ativa',
    description: 'Pilote por 7 dias consecutivos',
    category: 'time',
    criteria: { consecutive_days: 7 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 300,
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'monthly_streak',
    name: 'Mês Épico',
    description: 'Pilote por 30 dias consecutivos',
    category: 'time',
    criteria: { consecutive_days: 30 },
    badge_url: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=100',
    points: 1000,
    rarity: 'legendary',
    unlocked: false,
  },
];

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return '#4CAF50';
    case 'rare': return '#2196F3';
    case 'epic': return '#9C27B0';
    case 'legendary': return '#FF9800';
    default: return '#757575';
  }
};

export const getRarityGradient = (rarity: string) => {
  switch (rarity) {
    case 'common': return ['#4CAF50', '#66BB6A'];
    case 'rare': return ['#2196F3', '#42A5F5'];
    case 'epic': return ['#9C27B0', '#BA68C8'];
    case 'legendary': return ['#FF9800', '#FFB74D'];
    default: return ['#757575', '#9E9E9E'];
  }
};