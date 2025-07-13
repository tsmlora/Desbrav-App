import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { getSupabaseClient } from '../../../../lib/supabase';

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
