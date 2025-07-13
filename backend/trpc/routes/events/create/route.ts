import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { supabase } from "../../../../../lib/supabase";

const createEventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  location: z.string().min(1, "Local é obrigatório"),
  image_url: z.string().optional(),
  community_id: z.string().optional(),
});

export const createEventProcedure = publicProcedure
  .input(createEventSchema)
  .mutation(async ({ input }: { input: any }) => {
    try {
      // For now, we'll use a mock creator_id since we don't have auth
      const mockCreatorId = '00000000-0000-0000-0000-000000000001';

      const { data: event, error } = await supabase
        .from('events')
        .insert([
          {
            title: input.title,
            description: input.description,
            date: input.date,
            location: input.location,
            image_url: input.image_url || 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=2070',
            creator_id: mockCreatorId,
            community_id: input.community_id,
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return event;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar evento');
    }
  });

export default createEventProcedure;