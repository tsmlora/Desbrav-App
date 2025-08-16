import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

export const registerProcedure = publicProcedure
  .input(z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      // Create user with Supabase Auth
      const { data, error } = await ctx.supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            name: input.name,
          }
        }
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || 'Erro ao criar conta',
        });
      }

      if (!data.user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro interno do servidor',
        });
      }

      // Create user profile in our users table
      const profileData = {
        id: data.user.id,
        email: data.user.email!,
        name: input.name,
        bio: '',
        motorcycle: '',
        location: '',
        avatar_url: '',
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await ctx.supabase
        .from('users')
        .insert([profileData]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw error here, as the auth user was created successfully
      }

      return {
        success: true,
        message: "Conta criada com sucesso",
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: input.name,
        },
      };
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  });

export default registerProcedure;