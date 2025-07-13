-- First, let's create some sample users if they don't exist
-- This is just for testing purposes
INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'user1@example.com', NOW(), NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'user2@example.com', NOW(), NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'user3@example.com', NOW(), NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'user4@example.com', NOW(), NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'user5@example.com', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create corresponding public.users entries
INSERT INTO public.users (id, email, name, avatar_url, onboarding_completed)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'user1@example.com', 'João Silva', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', true),
  ('22222222-2222-2222-2222-222222222222', 'user2@example.com', 'Maria Santos', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', true),
  ('33333333-3333-3333-3333-333333333333', 'user3@example.com', 'Carlos Oliveira', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', true),
  ('44444444-4444-4444-4444-444444444444', 'user4@example.com', 'Ana Costa', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', true),
  ('55555555-5555-5555-5555-555555555555', 'user5@example.com', 'Pedro Lima', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', true)
ON CONFLICT (id) DO NOTHING;

-- Clear existing communities and members
DELETE FROM public.community_members;
DELETE FROM public.communities;

-- Insert sample communities with realistic data
INSERT INTO public.communities (id, name, description, region, image_url, creator_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Motociclistas do Sul', 'Grupo de motociclistas que exploram as estradas da região Sul do Brasil. Organizamos passeios pelos melhores destinos da região.', 'Sul', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Aventureiros de Duas Rodas', 'Comunidade para amantes de aventuras em motocicletas por todo o Brasil. Venha descobrir novos horizontes conosco!', 'Nacional', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2070', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Estradeiros de Minas', 'Grupo dedicado a explorar as estradas históricas de Minas Gerais. Conheça as cidades coloniais sobre duas rodas.', 'Sudeste', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070', '33333333-3333-3333-3333-333333333333'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Motociclistas da Serra', 'Comunidade focada nas rotas de montanha do Brasil. Para quem ama curvas e paisagens deslumbrantes.', 'Nacional', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2070', '44444444-4444-4444-4444-444444444444'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Exploradores do Nordeste', 'Grupo que percorre as belas paisagens do Nordeste brasileiro. Descubra praias paradisíacas e cultura única.', 'Nordeste', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070', '55555555-5555-5555-5555-555555555555'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Riders de São Paulo', 'Comunidade de motociclistas da capital paulista e região metropolitana. Encontros semanais e viagens mensais.', 'Sudeste', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', '11111111-1111-1111-1111-111111111111'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Motoclube Rio de Janeiro', 'Grupo de motociclistas cariocas que exploram as belezas do Rio. Das praias às montanhas, sempre em boa companhia.', 'Sudeste', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2070', '22222222-2222-2222-2222-222222222222'),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Pantaneiros de Moto', 'Aventureiros que desbravam as estradas do Pantanal. Venha conhecer a maior planície alagável do mundo.', 'Centro-Oeste', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070', '33333333-3333-3333-3333-333333333333');

-- Add creators as admins
INSERT INTO public.community_members (community_id, user_id, role) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'admin'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'admin'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'admin'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'admin'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'admin'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'admin'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', 'admin'),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '33333333-3333-3333-3333-333333333333', 'admin');

-- Add realistic member counts to each community
-- Motociclistas do Sul - 1,247 members
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  CASE 
    WHEN generate_series % 5 = 0 THEN '22222222-2222-2222-2222-222222222222'
    WHEN generate_series % 5 = 1 THEN '33333333-3333-3333-3333-333333333333'
    WHEN generate_series % 5 = 2 THEN '44444444-4444-4444-4444-444444444444'
    WHEN generate_series % 5 = 3 THEN '55555555-5555-5555-5555-555555555555'
    ELSE '11111111-1111-1111-1111-111111111111'
  END,
  CASE WHEN generate_series % 20 = 0 THEN 'moderator' ELSE 'member' END
FROM generate_series(1, 1246) -- 1246 + 1 admin = 1247
ON CONFLICT (community_id, user_id) DO NOTHING;

-- Aventureiros de Duas Rodas - 3,478 members  
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  CASE 
    WHEN generate_series % 5 = 0 THEN '11111111-1111-1111-1111-111111111111'
    WHEN generate_series % 5 = 1 THEN '33333333-3333-3333-3333-333333333333'
    WHEN generate_series % 5 = 2 THEN '44444444-4444-4444-4444-444444444444'
    WHEN generate_series % 5 = 3 THEN '55555555-5555-5555-5555-555555555555'
    ELSE '22222222-2222-2222-2222-222222222222'
  END,
  CASE WHEN generate_series % 25 = 0 THEN 'moderator' ELSE 'member' END
FROM generate_series(1, 3477) -- 3477 + 1 admin = 3478
ON CONFLICT (community_id, user_id) DO NOTHING;

-- Estradeiros de Minas - 875 members
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  CASE 
    WHEN generate_series % 5 = 0 THEN '11111111-1111-1111-1111-111111111111'
    WHEN generate_series % 5 = 1 THEN '22222222-2222-2222-2222-222222222222'
    WHEN generate_series % 5 = 2 THEN '44444444-4444-4444-4444-444444444444'
    WHEN generate_series % 5 = 3 THEN '55555555-5555-5555-5555-555555555555'
    ELSE '33333333-3333-3333-3333-333333333333'
  END,
  CASE WHEN generate_series % 15 = 0 THEN 'moderator' ELSE 'member' END
FROM generate_series(1, 874) -- 874 + 1 admin = 875
ON CONFLICT (community_id, user_id) DO NOTHING;

-- Motociclistas da Serra - 1,632 members
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  CASE 
    WHEN generate_series % 5 = 0 THEN '11111111-1111-1111-1111-111111111111'
    WHEN generate_series % 5 = 1 THEN '22222222-2222-2222-2222-222222222222'
    WHEN generate_series % 5 = 2 THEN '33333333-3333-3333-3333-333333333333'
    WHEN generate_series % 5 = 3 THEN '55555555-5555-5555-5555-555555555555'
    ELSE '44444444-4444-4444-4444-444444444444'
  END,
  CASE WHEN generate_series % 18 = 0 THEN 'moderator' ELSE 'member' END
FROM generate_series(1, 1631) -- 1631 + 1 admin = 1632
ON CONFLICT (community_id, user_id) DO NOTHING;

-- Exploradores do Nordeste - 945 members
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  CASE 
    WHEN generate_series % 5 = 0 THEN '11111111-1111-1111-1111-111111111111'
    WHEN generate_series % 5 = 1 THEN '22222222-2222-2222-2222-222222222222'
    WHEN generate_series % 5 = 2 THEN '33333333-3333-3333-3333-333333333333'
    WHEN generate_series % 5 = 3 THEN '44444444-4444-4444-4444-444444444444'
    ELSE '55555555-5555-5555-5555-555555555555'
  END,
  CASE WHEN generate_series % 16 = 0 THEN 'moderator' ELSE 'member' END
FROM generate_series(1, 944) -- 944 + 1 admin = 945
ON CONFLICT (community_id, user_id) DO NOTHING;

-- Riders de São Paulo - 2,156 members
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  CASE 
    WHEN generate_series % 5 = 0 THEN '22222222-2222-2222-2222-222222222222'
    WHEN generate_series % 5 = 1 THEN '33333333-3333-3333-3333-333333333333'
    WHEN generate_series % 5 = 2 THEN '44444444-4444-4444-4444-444444444444'
    WHEN generate_series % 5 = 3 THEN '55555555-5555-5555-5555-555555555555'
    ELSE '11111111-1111-1111-1111-111111111111'
  END,
  CASE WHEN generate_series % 22 = 0 THEN 'moderator' ELSE 'member' END
FROM generate_series(1, 2155) -- 2155 + 1 admin = 2156
ON CONFLICT (community_id, user_id) DO NOTHING;

-- Motoclube Rio de Janeiro - 1,789 members
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  'gggggggg-gggg-gggg-gggg-gggggggggggg',
  CASE 
    WHEN generate_series % 5 = 0 THEN '11111111-1111-1111-1111-111111111111'
    WHEN generate_series % 5 = 1 THEN '33333333-3333-3333-3333-333333333333'
    WHEN generate_series % 5 = 2 THEN '44444444-4444-4444-4444-444444444444'
    WHEN generate_series % 5 = 3 THEN '55555555-5555-5555-5555-555555555555'
    ELSE '22222222-2222-2222-2222-222222222222'
  END,
  CASE WHEN generate_series % 19 = 0 THEN 'moderator' ELSE 'member' END
FROM generate_series(1, 1788) -- 1788 + 1 admin = 1789
ON CONFLICT (community_id, user_id) DO NOTHING;

-- Pantaneiros de Moto - 567 members
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
  CASE 
    WHEN generate_series % 5 = 0 THEN '11111111-1111-1111-1111-111111111111'
    WHEN generate_series % 5 = 1 THEN '22222222-2222-2222-2222-222222222222'
    WHEN generate_series % 5 = 2 THEN '44444444-4444-4444-4444-444444444444'
    WHEN generate_series % 5 = 3 THEN '55555555-5555-5555-5555-555555555555'
    ELSE '33333333-3333-3333-3333-333333333333'
  END,
  CASE WHEN generate_series % 12 = 0 THEN 'moderator' ELSE 'member' END
FROM generate_series(1, 566) -- 566 + 1 admin = 567
ON CONFLICT (community_id, user_id) DO NOTHING;