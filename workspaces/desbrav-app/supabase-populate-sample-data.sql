-- Sample data for achievements
INSERT INTO achievements (name, description, category, target_value, badge_url, points)
VALUES
  ('Primeiro Centenário', 'Complete 100km em uma única viagem', 'distance', 100000, '/badges/100km.png', 100),
  ('Explorador', 'Visite 10 cidades diferentes', 'exploration', 10, '/badges/explorer.png', 250),
  ('Velocista', 'Mantenha uma velocidade média de 80km/h por 1 hora', 'speed', 80, '/badges/speed.png', 200),
  ('Maratonista', 'Complete 500km no total', 'distance', 500000, '/badges/500km.png', 300),
  ('Socializador', 'Participe de 5 grupos de pilotagem', 'social', 5, '/badges/social.png', 150);

-- Sample data for communities
INSERT INTO communities (name, description, image_url, created_by)
VALUES
  ('Motoqueiros SP', 'Grupo de motoqueiros de São Paulo', 'https://images.unsplash.com/photo-1558980664-2cd6634dccc5', NULL),
  ('Aventureiros BR', 'Para quem gosta de aventuras pelo Brasil', 'https://images.unsplash.com/photo-1528826104212-b96c68e6c5ee', NULL),
  ('Harley Lovers', 'Amantes de Harley Davidson', 'https://images.unsplash.com/photo-1561580126-028ee0a58a73', NULL);

-- Sample data for events
INSERT INTO events (name, description, date, location, community_id, created_by)
VALUES
  ('Rolê na Serra', 'Um passeio pela Serra da Mantiqueira', '2025-08-01T10:00:00Z', 'Campos do Jordão, SP', (SELECT id FROM communities WHERE name = 'Motoqueiros SP'), NULL),
  ('Encontro Nacional', 'Encontro nacional de motoqueiros', '2025-09-15T09:00:00Z', 'Brasília, DF', (SELECT id FROM communities WHERE name = 'Aventureiros BR'), NULL),
  ('Harley Day', 'Dia de celebrar as Harleys', '2025-10-10T11:00:00Z', 'São Paulo, SP', (SELECT id FROM communities WHERE name = 'Harley Lovers'), NULL);
