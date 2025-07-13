import { protectedProcedure } from '../../create-context';
import { z } from 'zod';
import { getSupabaseClient } from '../../../../lib/supabase';

export const listEventsProcedure = protectedProcedure
  .query(async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('events')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });

export const createEventProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      location: z.string(),
      community_id: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('events')
      .insert({
        name: input.name,
        description: input.description,
        date: input.date,
        location: input.location,
        community_id: input.community_id,
        created_by: ctx.user.id,
      })
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
