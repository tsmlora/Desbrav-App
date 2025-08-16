import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  if (error?.details) {
    return error.details;
  }

  if (error?.hint) {
    return error.hint;
  }

  if (error?.code) {
    switch (error.code) {
      case '23505':
        return 'Este email já está em uso';
      case '42501':
        return 'Permissão negada';
      case '42P01':
        return 'Tabela não encontrada';
      case 'PGRST116':
        return 'Perfil não encontrado';
      default:
        return `Erro do banco de dados (${error.code})`;
    }
  }
  
  if (typeof error === 'object' && error !== null) {
    try {
      if (error.severity && error.message) {
        return error.message;
      }
      
      if (error.error && typeof error.error === 'object') {
        return getErrorMessage(error.error);
      }
      
      const stringified = JSON.stringify(error, null, 2);
      if (stringified !== '{}') {
        return `Erro: ${stringified}`;
      }
    } catch {
      // If JSON.stringify fails, return generic message
    }
  }
  
  return 'Erro inesperado ao processar solicitação';
};

export const getProfileProcedure = protectedProcedure
  .input(z.object({
    userId: z.string().optional(),
  }))
  .query(async ({ input, ctx }) => {
    try {
      // Use the userId from input or fallback to authenticated user
      const userId = input.userId || ctx.user.id;
      console.log('Backend: Getting profile for user:', userId);
      
      const { data: user, error } = await ctx.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Backend: Error fetching profile:', errorMessage);
        
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: errorMessage,
        });
      }

      console.log('Backend: Profile fetched successfully:', user);
      
      return {
        success: true,
        user,
      };
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error('Backend: Error in getProfileProcedure:', errorMessage);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: errorMessage,
      });
    }
  });

export const updateProfileProcedure = protectedProcedure
  .input(z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    motorcycle: z.string().optional(),
    location: z.string().optional(),
    avatar_url: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      const userId = ctx.user.id;
      console.log('Backend: Updating profile for user:', userId);
      console.log('Backend: Update data:', input);
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Only include fields that are provided
      if (input.name !== undefined) updateData.name = input.name;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.motorcycle !== undefined) updateData.motorcycle = input.motorcycle;
      if (input.location !== undefined) updateData.location = input.location;
      if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url;

      console.log('Backend: Final update data:', updateData);

      const { data: user, error } = await ctx.supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Backend: Error updating profile:', errorMessage);
        
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: errorMessage,
        });
      }

      console.log('Backend: Profile updated successfully:', user);
      
      return {
        success: true,
        message: "Perfil atualizado com sucesso",
        user,
      };
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error('Backend: Error in updateProfileProcedure:', errorMessage);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: errorMessage,
      });
    }
  });

export default updateProfileProcedure;