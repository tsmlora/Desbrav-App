import { protectedProcedure, publicProcedure } from '../../create-context';
import { z } from 'zod';
import { getSupabaseClient } from '../../../../lib/supabase';

export const getProfileProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', ctx.user.id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });

export const updateProfileProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string().optional(),
      bio: z.string().optional(),
      motorcycle: z.string().optional(),
      location: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(input)
      .eq('id', ctx.user.id)
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
