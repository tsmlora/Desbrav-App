import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { getSupabaseClient } from '../../../../lib/supabase';

export const registerProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.name,
        },
      },
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
