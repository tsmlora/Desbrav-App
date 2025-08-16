import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

export const devSetupProcedure = publicProcedure
  .mutation(async ({ ctx }) => {
    try {
      const devEmail = "lorenzoluiz41@gmail.com";
      const devPassword = "123456";
      const devName = "Lorenzo Luiz";

      // First, try to sign up the user
      const { error: signUpError } = await ctx.supabase.auth.signUp({
        email: devEmail,
        password: devPassword,
        options: {
          data: {
            name: devName,
          }
        }
      });

      // If user already exists, that's fine
      if (signUpError && !signUpError.message.includes('already registered')) {
        console.error('Dev setup signup error:', signUpError);
      }

      // Now sign in to get the user ID
      const { data: signInData, error: signInError } = await ctx.supabase.auth.signInWithPassword({
        email: devEmail,
        password: devPassword,
      });

      if (signInError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao fazer login do usuário de desenvolvimento',
        });
      }

      if (!signInData.user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Usuário não encontrado após login',
        });
      }

      // Create or update user profile in our users table
      const profileData = {
        id: signInData.user.id,
        email: devEmail,
        name: devName,
        bio: 'Motociclista apaixonado por aventuras e trilhas. Sempre em busca de novas rotas e experiências sobre duas rodas.',
        motorcycle: 'Honda CB 600F Hornet',
        location: 'São Paulo, SP',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        onboarding_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to insert, if it fails due to conflict, update instead
      const { error: insertError } = await ctx.supabase
        .from('users')
        .insert([profileData]);

      if (insertError && insertError.code === '23505') {
        // User already exists, update instead
        const { error: updateError } = await ctx.supabase
          .from('users')
          .update({
            name: profileData.name,
            bio: profileData.bio,
            motorcycle: profileData.motorcycle,
            location: profileData.location,
            avatar_url: profileData.avatar_url,
            onboarding_completed: profileData.onboarding_completed,
            updated_at: profileData.updated_at
          })
          .eq('id', signInData.user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
        }
      } else if (insertError) {
        console.error('Profile creation error:', insertError);
      }

      return {
        success: true,
        message: "Usuário de desenvolvimento configurado com sucesso",
        user: profileData,
        credentials: {
          email: devEmail,
          password: devPassword
        }
      };
    } catch (error: any) {
      console.error('Dev setup error:', error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor durante configuração de desenvolvimento',
      });
    }
  });

export default devSetupProcedure;