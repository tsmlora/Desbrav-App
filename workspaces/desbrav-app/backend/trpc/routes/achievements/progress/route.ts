import { protectedProcedure } from '../../create-context';
import { z } from 'zod';
import { getSupabaseClient } from '../../../../lib/supabase';

export const getProgressProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('achievement_progress')
      .select('*')
      .eq('user_id', ctx.user.id);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });

export const updateProgressProcedure = protectedProcedure
  .input(
    z.object({
      achievement_id: z.string(),
      progress: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('achievement_progress')
      .upsert({
        user_id: ctx.user.id,
        achievement_id: input.achievement_id,
        progress: input.progress,
      })
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
