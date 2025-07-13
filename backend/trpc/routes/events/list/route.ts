import { publicProcedure } from "../../../create-context";
import { supabase } from "../../../../../lib/supabase";

export const listEventsProcedure = publicProcedure.query(async () => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:users(name),
        community:communities(name)
      `)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return events || [];
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao buscar eventos');
  }
});

export default listEventsProcedure;