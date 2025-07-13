import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    req: opts.req,
    // You can add more context items here like database connections, auth, etc.
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const router = t.router; // Add this export
export const publicProcedure = t.procedure;

// Protected procedure with authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // For now, we'll create a mock user context
  // In a real app, you'd validate JWT tokens or session cookies here
  const mockUser = {
    id: 'user-123',
    email: 'user@example.com',
    name: 'Test User'
  };

  return next({
    ctx: {
      ...ctx,
      user: mockUser,
    },
  });
});