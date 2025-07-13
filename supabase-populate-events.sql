-- Insert sample events
INSERT INTO events (id, title, description, date, location, image_url, creator_id) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Encontro de Motociclistas da Serra',
  'Evento anual que reúne motociclistas para percorrer a Serra do Rio do Rastro. Uma experiência única com paisagens deslumbrantes e muita adrenalina.',
  '2024-03-15',
  'Urubici, SC',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
  '00000000-0000-0000-0000-000000000001'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Expedição Estrada Real',
  'Viagem em grupo pela histórica Estrada Real, com paradas em cidades coloniais e degustação da culinária mineira.',
  '2024-04-20',
  'Ouro Preto, MG',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
  '00000000-0000-0000-0000-000000000001'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Rota Romântica em Grupo',
  'Passeio pelas charmosas cidades da Rota Romântica no Rio Grande do Sul, incluindo Gramado e Canela.',
  '2024-05-10',
  'Gramado, RS',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
  '00000000-0000-0000-0000-000000000001'
),
(
  '44444444-4444-4444-4444-444444444444',
  'Desafio Transpantaneira',
  'Aventura em grupo pela famosa estrada do Pantanal Mato-grossense. Prepare-se para lama, poeira e muita natureza.',
  '2024-06-05',
  'Poconé, MT',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
  '00000000-0000-0000-0000-000000000001'
),
(
  '55555555-5555-5555-5555-555555555555',
  'Encontro na Rodovia dos Tamoios',
  'Passeio em grupo pela Rodovia dos Tamoios até o litoral norte de São Paulo, com parada em Caraguatatuba.',
  '2024-07-12',
  'Caraguatatuba, SP',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
  '00000000-0000-0000-0000-000000000001'
),
(
  '66666666-6666-6666-6666-666666666666',
  'Rally do Nordeste',
  'Expedição pelas belezas naturais do Nordeste brasileiro, passando por praias paradisíacas e cidades históricas.',
  '2024-08-18',
  'Natal, RN',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
  '00000000-0000-0000-0000-000000000001'
),
(
  '77777777-7777-7777-7777-777777777777',
  'Aventura na Chapada Diamantina',
  'Exploração das trilhas e cachoeiras da Chapada Diamantina, com acampamento e muito contato com a natureza.',
  '2024-09-22',
  'Lençóis, BA',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
  '00000000-0000-0000-0000-000000000001'
),
(
  '88888888-8888-8888-8888-888888888888',
  'Rota dos Cânions',
  'Percurso pelos impressionantes cânions do Sul do Brasil, com paisagens de tirar o fôlego.',
  '2024-10-14',
  'Cambará do Sul, RS',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
  '00000000-0000-0000-0000-000000000001'
);

-- Add some participants to events
INSERT INTO event_participants (event_id, user_id) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001'),
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000002'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000002');