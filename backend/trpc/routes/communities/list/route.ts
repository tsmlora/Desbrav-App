import { publicProcedure } from '../../../create-context';
import { supabase } from '../../../../../lib/supabase';

export const listCommunitiesProcedure = publicProcedure.query(async () => {
  try {
    // Get all communities first
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (communitiesError) {
      throw new Error(communitiesError.message);
    }
    
    // Get member counts for each community
    const communitiesWithCount = await Promise.all(
      (communities || []).map(async (community) => {
        const { count, error: countError } = await supabase
          .from('community_members')
          .select('*', { count: 'exact', head: true })
          .eq('community_id', community.id);
        
        if (countError) {
          console.error('Error counting members for community', community.id, countError);
        }
        
        return {
          ...community,
          members: count || 0
        };
      })
    );
    
    return communitiesWithCount;
  } catch (error) {
    console.error('Error fetching communities:', error);
    throw new Error('Failed to fetch communities');
  }
});

export default listCommunitiesProcedure;