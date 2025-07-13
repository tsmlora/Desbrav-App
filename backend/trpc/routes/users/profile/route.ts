import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for backend use with service key for admin operations
const supabaseUrl = 'https://juiffgxububozvqzvhih.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aWZmZ3h1YnVib3p2cXp2aGloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgzMjU3NSwiZXhwIjoyMDY3NDA4NTc1fQ.example';

// For now, use anon key since we don't have service key
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aWZmZ3h1YnVib3p2cXp2aGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzI1NzUsImV4cCI6MjA2NzQwODU3NX0.jFiEFFw98GmRrNb09lApUmEYZ0JHnfP6SmE1mYzG9kw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export const getProfileProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    try {
      console.log('Backend: Getting profile for user:', input.userId);
      
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', input.userId)
        .single();
      
      if (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Backend: Error fetching profile:', errorMessage);
        
        return {
          success: false,
          message: errorMessage,
          user: null,
        };
      }

      console.log('Backend: Profile fetched successfully:', user);
      
      return {
        success: true,
        user,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Backend: Error in getProfileProcedure:', errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        user: null,
      };
    }
  });

export const updateProfileProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    name: z.string().optional(),
    bio: z.string().optional(),
    motorcycle: z.string().optional(),
    location: z.string().optional(),
    avatar_url: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    try {
      console.log('Backend: Updating profile for user:', input.userId);
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

      const { data: user, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', input.userId)
        .select()
        .single();
      
      if (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Backend: Error updating profile:', errorMessage);
        
        return {
          success: false,
          message: errorMessage,
          user: null,
        };
      }

      console.log('Backend: Profile updated successfully:', user);
      
      return {
        success: true,
        message: "Perfil atualizado com sucesso",
        user,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Backend: Error in updateProfileProcedure:', errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        user: null,
      };
    }
  });

export default updateProfileProcedure;