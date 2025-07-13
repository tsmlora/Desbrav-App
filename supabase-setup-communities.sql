-- Insert sample communities with regions
INSERT INTO public.communities (name, description, region, image_url, creator_id) VALUES
('Motociclistas do Sul', 'Grupo de motociclistas que exploram as estradas da região Sul do Brasil.', 'Sul', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', (SELECT id FROM auth.users LIMIT 1)),
('Aventureiros de Duas Rodas', 'Comunidade para amantes de aventuras em motocicletas por todo o Brasil.', 'Nacional', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', (SELECT id FROM auth.users LIMIT 1)),
('Estradeiros de Minas', 'Grupo dedicado a explorar as estradas históricas de Minas Gerais.', 'Sudeste', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', (SELECT id FROM auth.users LIMIT 1)),
('Motociclistas da Serra', 'Comunidade focada nas rotas de montanha do Brasil.', 'Nacional', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', (SELECT id FROM auth.users LIMIT 1)),
('Exploradores do Nordeste', 'Grupo que percorre as belas paisagens do Nordeste brasileiro.', 'Nordeste', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', (SELECT id FROM auth.users LIMIT 1)),
('Riders de São Paulo', 'Comunidade de motociclistas da capital paulista e região metropolitana.', 'Sudeste', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', (SELECT id FROM auth.users LIMIT 1)),
('Motoclube Rio de Janeiro', 'Grupo de motociclistas cariocas que exploram as belezas do Rio.', 'Sudeste', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', (SELECT id FROM auth.users LIMIT 1)),
('Pantaneiros de Moto', 'Aventureiros que desbravam as estradas do Pantanal.', 'Centro-Oeste', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070', (SELECT id FROM auth.users LIMIT 1));

-- Insert sample community members to make communities look active
-- First, add creators as admins
INSERT INTO public.community_members (community_id, user_id, role)
SELECT 
  c.id,
  c.creator_id,
  'admin'
FROM public.communities c
ON CONFLICT (community_id, user_id) DO NOTHING;

-- Add some random members to each community
-- This will create realistic member counts
DO $$
DECLARE
    community_record RECORD;
    user_record RECORD;
    member_count INTEGER;
BEGIN
    -- For each community, add random members
    FOR community_record IN SELECT id FROM public.communities LOOP
        member_count := floor(random() * 50 + 10)::INTEGER; -- Between 10-60 members
        
        -- Add random users as members
        INSERT INTO public.community_members (community_id, user_id, role)
        SELECT 
            community_record.id,
            u.id,
            CASE 
                WHEN random() < 0.1 THEN 'moderator'
                ELSE 'member'
            END
        FROM (
            SELECT id FROM auth.users 
            ORDER BY random() 
            LIMIT member_count
        ) u
        ON CONFLICT (community_id, user_id) DO NOTHING;
    END LOOP;
END $$;