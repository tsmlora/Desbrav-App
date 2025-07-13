import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { supabase } from '../../../../../lib/supabase';

const joinCommunitySchema = z.object({
  communityId: z.string(),
});

type JoinCommunityInput = z.infer<typeof joinCommunitySchema>;

interface ProtectedContext {
  req: Request;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const joinCommunityProcedure = protectedProcedure
  .input(joinCommunitySchema)
  .mutation(async ({ input, ctx }: { input: JoinCommunityInput; ctx: ProtectedContext }) => {
    try {
      const { communityId } = input;
      const userId = ctx.user.id;

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('community_members')
        .select('id')
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        throw new Error('User is already a member of this community');
      }

      // Add user to community
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: userId,
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Error joining community:', error);
      throw new Error('Failed to join community');
    }
  });

export default joinCommunityProcedure;