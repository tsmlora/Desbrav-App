import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { users } from "../../auth/register/route";

export const searchUsersProcedure = publicProcedure
  .input(z.object({
    query: z.string().min(1, "Termo de busca é obrigatório"),
  }))
  .query(({ input }) => {
    const searchTerm = input.query.toLowerCase();
    
    // Search users by name or username
    const matchingUsers = users
      .filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
      )
      .map(user => {
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      })
      .slice(0, 20); // Limit to 20 results

    return {
      success: true,
      users: matchingUsers,
    };
  });

export default searchUsersProcedure;