import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://juiffgxububozvqzvhih.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aWZmZ3h1YnVib3p2cXp2aGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzI1NzUsImV4cCI6MjA2NzQwODU3NX0.jFiEFFw98GmRrNb09lApUmEYZ0JHnfP6SmE1mYzG9kw'

// Create Supabase client for backend
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  // Extract authorization header
  const authHeader = opts.req.headers.get('authorization')
  let user = null

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token)
      if (!error && authUser) {
        user = authUser
      }
    } catch (error) {
      console.error('Error verifying token:', error)
    }
  }

  return {
    req: opts.req,
    supabase,
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure with authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Você precisa estar logado para acessar este recurso',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});