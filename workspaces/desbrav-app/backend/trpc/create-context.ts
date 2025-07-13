import { initTRPC } from '@trpc/server';
import { Context } from 'hono';
import { getSupabaseClient } from '../lib/supabase';

export const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  const authHeader = ctx.req.header('Authorization');
  if (!authHeader) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    throw new Error('Unauthorized');
  }
  return opts.next({ ctx: { user: data.user } });
});
