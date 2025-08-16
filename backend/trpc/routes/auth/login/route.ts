import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

export const loginProcedure = publicProcedure
  .input(z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      // Sign in with Supabase Auth
      const { data, error } = await ctx.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Usuário ou senha incorretos',
        });
      }

      if (!data.user || !data.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Usuário ou senha incorretos',
        });
      }

      // Get user profile from our users table
      const { data: profile, error: profileError } = await ctx.supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      const userData = profile || {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || 'Usuário',
        bio: '',
        motorcycle: '',
        location: '',
        avatar_url: '',
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return {
        success: true,
        message: "Login realizado com sucesso",
        user: userData,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  });

export default loginProcedure;