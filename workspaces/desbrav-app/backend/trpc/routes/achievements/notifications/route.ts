import { protectedProcedure } from '../../create-context';
import { z } from 'zod';
import { getSupabaseClient } from '../../../../lib/supabase';

export const getNotificationsProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('achievement_notifications')
      .select('*')
      .eq('user_id', ctx.user.id)
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });

export const markNotificationReadProcedure = protectedProcedure
  .input(
    z.object({
      notification_id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('achievement_notifications')
      .update({ is_read: true })
      .eq('id', input.notification_id)
      .eq('user_id', ctx.user.id)
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  });
