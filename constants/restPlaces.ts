export interface RestPlace {
  id: string;
  name: string;
  type: 'Hotel' | 'Pousada' | 'Camping' | 'Restaurante';
  description: string;
  address: string;
  region: string;
  price: '€' | '€€' | '€€€';
  amenities: string[];
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
}

export const restPlaces: RestPlace[] = [
  {
    id: '1',
    name: 'Pousada do Motociclista',
    type: 'Pousada',
    description: 'Pousada especializada em receber motociclistas, com estacionamento seguro e ferramentas disponíveis.',
    address: 'Estrada da Serra, km 10, Urubici - SC',
    region: 'Santa Catarina',
    price: '€€',
    amenities: ['Estacionamento coberto', 'Oficina básica', 'Café da manhã', 'Wi-Fi'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    coordinates: {
      latitude: -28.0153,
      longitude: -49.5925
    },
    rating: 4.8
  },
  {
    id: '2',
    name: 'Hotel Estrada Real',
    type: 'Hotel',
    description: 'Hotel com estrutura completa para motociclistas que percorrem a Estrada Real.',
    address: 'Rua Principal, 123, Ouro Preto - MG',
    region: 'Minas Gerais',
    price: '€€€',
    amenities: ['Estacionamento privativo', 'Restaurante', 'Spa', 'Lavagem de motos'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    coordinates: {
      latitude: -20.3855,
      longitude: -43.5035
    },
    rating: 4.6
  },
  {
    id: '3',
    name: 'Camping Serra Gaúcha',
    type: 'Camping',
    description: 'Área de camping com infraestrutura para motociclistas em meio à natureza.',
    address: 'Estrada da Montanha, km 25, Gramado - RS',
    region: 'Rio Grande do Sul',
    price: '€',
    amenities: ['Área para barracas', 'Churrasqueiras', 'Banheiros', 'Segurança 24h'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    coordinates: {
      latitude: -29.3780,
      longitude: -50.8738
    },
    rating: 4.2
  },
  {
    id: '4',
    name: 'Restaurante do Motoqueiro',
    type: 'Restaurante',
    description: 'Ponto de parada tradicional para motociclistas, com comida caseira e ambiente acolhedor.',
    address: 'Rodovia BR-116, km 230, Registro - SP',
    region: 'São Paulo',
    price: '€€',
    amenities: ['Estacionamento amplo', 'Refeições completas', 'Área de descanso', 'Loja de conveniência'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    coordinates: {
      latitude: -24.4874,
      longitude: -47.8446
    },
    rating: 4.5
  },
  {
    id: '5',
    name: 'Pousada Pantanal',
    type: 'Pousada',
    description: 'Pousada rústica com conforto para os aventureiros que exploram o Pantanal.',
    address: 'Transpantaneira, km 50, Poconé - MT',
    region: 'Mato Grosso',
    price: '€€',
    amenities: ['Estacionamento', 'Restaurante regional', 'Passeios guiados', 'Ar condicionado'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    coordinates: {
      latitude: -16.2650,
      longitude: -56.6254
    },
    rating: 4.3
  }
];