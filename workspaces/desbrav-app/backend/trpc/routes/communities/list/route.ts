import { protectedProcedure } from '../../create-context';
import { z } from 'zod';
import { getSupabaseClient } from '../../../../lib/supabase';

export const listCommunitiesProcedure = protectedProcedure
  .query(async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('communities')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });

export const joinCommunityProcedure = protectedProcedure
  .input(
    z.object({
      communityId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('community_members')
      .insert({
        user_id: ctx.user.id,
        community_id: input.communityId,
      })
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });

export const createCommunityProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      image_url: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: input.name,
        description: input.description,
        image_url: input.image_url,
        created_by: ctx.user.id,
      })
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
