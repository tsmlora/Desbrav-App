export interface Route {
  id: string;
  name: string;
  description: string;
  distance: string;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil' | 'Extremo';
  region: string;
  image: string;
  dangers: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  medal: {
    name: string;
    image: string;
    description: string;
  };
}

export const routes: Route[] = [
  {
    id: '1',
    name: 'Serra do Rio do Rastro',
    description: 'Uma das estradas mais impressionantes do Brasil, com curvas sinuosas e vistas deslumbrantes.',
    distance: '12 km',
    difficulty: 'Difícil',
    region: 'Santa Catarina',
    image: 'https://images.unsplash.com/photo-1605649461784-edc01b1d8c2e?q=80&w=2070',
    dangers: [
      'Neblina frequente',
      'Curvas fechadas',
      'Tráfego intenso nos finais de semana'
    ],
    coordinates: {
      latitude: -28.3894,
      longitude: -49.5481
    },
    medal: {
      name: 'Conquistador da Serra',
      image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
      description: 'Concedida aos motociclistas que completam o desafio da Serra do Rio do Rastro.'
    }
  },
  {
    id: '2',
    name: 'Estrada Real',
    description: 'Rota histórica que liga Minas Gerais ao litoral do Rio de Janeiro, passando por cidades coloniais.',
    distance: '1.630 km',
    difficulty: 'Moderado',
    region: 'Minas Gerais/Rio de Janeiro',
    image: 'https://images.unsplash.com/photo-1605649461784-edc01b1d8c2e?q=80&w=2070',
    dangers: [
      'Trechos de estrada de terra',
      'Áreas remotas com pouco sinal de celular',
      'Chuvas intensas na estação úmida'
    ],
    coordinates: {
      latitude: -20.3867,
      longitude: -43.5035
    },
    medal: {
      name: 'Explorador Real',
      image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
      description: 'Para os aventureiros que percorrem a histórica Estrada Real.'
    }
  },
  {
    id: '3',
    name: 'Rota Romântica',
    description: 'Inspirada na Romantische Strasse alemã, esta rota passa por charmosas cidades de colonização germânica.',
    distance: '184 km',
    difficulty: 'Fácil',
    region: 'Rio Grande do Sul',
    image: 'https://images.unsplash.com/photo-1605649461784-edc01b1d8c2e?q=80&w=2070',
    dangers: [
      'Neblina matinal',
      'Tráfego turístico intenso',
      'Temperaturas baixas no inverno'
    ],
    coordinates: {
      latitude: -29.6747,
      longitude: -51.1144
    },
    medal: {
      name: 'Coração Romântico',
      image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
      description: 'Dedicada aos motociclistas que apreciam a beleza da Rota Romântica.'
    }
  },
  {
    id: '4',
    name: 'Transpantaneira',
    description: 'Estrada que corta o Pantanal Mato-grossense, oferecendo vistas incríveis da fauna e flora.',
    distance: '147 km',
    difficulty: 'Extremo',
    region: 'Mato Grosso',
    image: 'https://images.unsplash.com/photo-1605649461784-edc01b1d8c2e?q=80&w=2070',
    dangers: [
      'Estrada de terra com atoleiros',
      'Travessias de pontes precárias',
      'Animais selvagens na pista',
      'Calor extremo'
    ],
    coordinates: {
      latitude: -16.3000,
      longitude: -56.7000
    },
    medal: {
      name: 'Desbravador do Pantanal',
      image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
      description: 'Reservada para os corajosos que enfrentam os desafios da Transpantaneira.'
    }
  },
  {
    id: '5',
    name: 'Rodovia dos Tamoios',
    description: 'Liga o Vale do Paraíba ao litoral norte de São Paulo, com belas paisagens da Serra do Mar.',
    distance: '82 km',
    difficulty: 'Moderado',
    region: 'São Paulo',
    image: 'https://images.unsplash.com/photo-1605649461784-edc01b1d8c2e?q=80&w=2070',
    dangers: [
      'Neblina frequente',
      'Tráfego intenso em feriados',
      'Chuvas fortes no verão'
    ],
    coordinates: {
      latitude: -23.4352,
      longitude: -45.0858
    },
    medal: {
      name: 'Guerreiro Tamoio',
      image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
      description: 'Homenagem aos motociclistas que dominam as curvas da Rodovia dos Tamoios.'
    }
  }
];