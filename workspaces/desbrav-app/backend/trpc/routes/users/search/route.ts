import { protectedProcedure } from '../../create-context';
import { z } from 'zod';
import { getSupabaseClient } from '../../../../lib/supabase';

export const searchUsersProcedure = protectedProcedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({ input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('name', `%${input.query}%`);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
