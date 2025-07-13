import { Community, Event, Medal, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Ricardo Oliveira',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780',
  bio: 'Motociclista apaixonado por estradas e aventuras. Piloto há mais de 15 anos.',
  motorcycle: 'BMW R 1250 GS Adventure',
  location: 'São Paulo, SP',
  medals: [
    {
      id: '1',
      name: 'Conquistador da Serra',
      image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
      description: 'Concedida aos motociclistas que completam o desafio da Serra do Rio do Rastro.',
      dateEarned: '2023-05-15',
      routeId: '1'
    },
    {
      id: '2',
      name: 'Explorador Real',
      image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
      description: 'Para os aventureiros que percorrem a histórica Estrada Real.',
      dateEarned: '2023-07-22',
      routeId: '2'
    }
  ],
  friends: ['2', '3', '4'],
  completedRoutes: ['1', '2']
};

export const mockMedals: Medal[] = [
  {
    id: '1',
    name: 'Conquistador da Serra',
    image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
    description: 'Concedida aos motociclistas que completam o desafio da Serra do Rio do Rastro.',
    dateEarned: '2023-05-15',
    routeId: '1'
  },
  {
    id: '2',
    name: 'Explorador Real',
    image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
    description: 'Para os aventureiros que percorrem a histórica Estrada Real.',
    dateEarned: '2023-07-22',
    routeId: '2'
  },
  {
    id: '3',
    name: 'Coração Romântico',
    image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
    description: 'Dedicada aos motociclistas que apreciam a beleza da Rota Romântica.',
    dateEarned: '',
    routeId: '3'
  },
  {
    id: '4',
    name: 'Desbravador do Pantanal',
    image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
    description: 'Reservada para os corajosos que enfrentam os desafios da Transpantaneira.',
    dateEarned: '',
    routeId: '4'
  },
  {
    id: '5',
    name: 'Guerreiro Tamoio',
    image: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=1974',
    description: 'Homenagem aos motociclistas que dominam as curvas da Rodovia dos Tamoios.',
    dateEarned: '',
    routeId: '5'
  }
];

export const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Motociclistas do Sul',
    description: 'Grupo de motociclistas que exploram as estradas da região Sul do Brasil.',
    members: 1250,
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    region: 'Sul'
  },
  {
    id: '2',
    name: 'Aventureiros de Duas Rodas',
    description: 'Comunidade para amantes de aventuras em motocicletas por todo o Brasil.',
    members: 3478,
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    region: 'Nacional'
  },
  {
    id: '3',
    name: 'Estradeiros de Minas',
    description: 'Grupo dedicado a explorar as estradas históricas de Minas Gerais.',
    members: 875,
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    region: 'Sudeste'
  },
  {
    id: '4',
    name: 'Motociclistas da Serra',
    description: 'Comunidade focada nas rotas de montanha do Brasil.',
    members: 1632,
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    region: 'Nacional'
  },
  {
    id: '5',
    name: 'Exploradores do Nordeste',
    description: 'Grupo que percorre as belas paisagens do Nordeste brasileiro.',
    members: 945,
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    region: 'Nordeste'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Encontro de Motociclistas da Serra',
    description: 'Evento anual que reúne motociclistas para percorrer a Serra do Rio do Rastro.',
    date: '2023-10-15',
    location: 'Urubici, SC',
    organizer: 'Motociclistas do Sul',
    participants: ['1', '2', '3', '4', '5'],
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    coordinates: {
      latitude: -28.0153,
      longitude: -49.5925
    }
  },
  {
    id: '2',
    title: 'Expedição Estrada Real',
    description: 'Viagem em grupo pela histórica Estrada Real, com paradas em cidades coloniais.',
    date: '2023-11-05',
    location: 'Ouro Preto, MG',
    organizer: 'Estradeiros de Minas',
    participants: ['1', '3', '6', '7'],
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    coordinates: {
      latitude: -20.3855,
      longitude: -43.5035
    }
  },
  {
    id: '3',
    title: 'Rota Romântica em Grupo',
    description: 'Passeio pelas charmosas cidades da Rota Romântica no Rio Grande do Sul.',
    date: '2023-09-25',
    location: 'Gramado, RS',
    organizer: 'Motociclistas do Sul',
    participants: ['2', '5', '8', '9'],
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    coordinates: {
      latitude: -29.3780,
      longitude: -50.8738
    }
  },
  {
    id: '4',
    title: 'Desafio Transpantaneira',
    description: 'Aventura em grupo pela famosa estrada do Pantanal Mato-grossense.',
    date: '2023-08-10',
    location: 'Poconé, MT',
    organizer: 'Aventureiros de Duas Rodas',
    participants: ['1', '4', '10', '11'],
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    coordinates: {
      latitude: -16.2650,
      longitude: -56.6254
    }
  },
  {
    id: '5',
    title: 'Encontro na Rodovia dos Tamoios',
    description: 'Passeio em grupo pela Rodovia dos Tamoios até o litoral norte de São Paulo.',
    date: '2023-12-03',
    location: 'Caraguatatuba, SP',
    organizer: 'Motociclistas da Serra',
    participants: ['3', '6', '12', '13'],
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
    coordinates: {
      latitude: -23.6237,
      longitude: -45.4122
    }
  }
];