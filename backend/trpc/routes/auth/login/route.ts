import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { users } from "../register/route";

export const loginProcedure = publicProcedure
  .input(z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
  }))
  .mutation(({ input }) => {
    // Find user by email
    const user = users.find(u => u.email === input.email);
    
    if (!user) {
      return {
        success: false,
        message: "Email não encontrado",
        user: null,
      };
    }

    // Check password (in production, use proper password hashing)
    if (user.password !== input.password) {
      return {
        success: false,
        message: "Senha incorreta",
        user: null,
      };
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: "Login realizado com sucesso",
      user: userWithoutPassword,
    };
  });

export default loginProcedure;