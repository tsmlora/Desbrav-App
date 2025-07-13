import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { supabase } from '../../../../../lib/supabase';

const createCommunitySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  region: z.string().min(1, 'Região é obrigatória'),
  image_url: z.string().url().optional(),
});

type CreateCommunityInput = z.infer<typeof createCommunitySchema>;

interface ProtectedContext {
  req: Request;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const createCommunityProcedure = protectedProcedure
  .input(createCommunitySchema)
  .mutation(async ({ input, ctx }: { input: CreateCommunityInput; ctx: ProtectedContext }) => {
    try {
      const { name, description, region, image_url } = input;
      const userId = ctx.user.id;

      // Create community
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .insert({
          name,
          description,
          region,
          image_url: image_url || 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
          creator_id: userId,
        })
        .select()
        .single();

      if (communityError) {
        throw new Error(communityError.message);
      }

      // Add creator as first member
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: userId,
          role: 'admin',
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
      }

      return community;
    } catch (error) {
      console.error('Error creating community:', error);
      throw new Error('Failed to create community');
    }
  });

export default createCommunityProcedure;