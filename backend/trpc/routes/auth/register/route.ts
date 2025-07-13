import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// In-memory user storage (in production, use a real database)
const users: Array<{
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  motorcycle?: string;
  location?: string;
  createdAt: string;
}> = [];

export const registerProcedure = publicProcedure
  .input(z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  }))
  .mutation(({ input }) => {
    // Check if email already exists
    const existingEmail = users.find(user => user.email === input.email);
    if (existingEmail) {
      return {
        success: false,
        message: "Este email já está em uso",
        user: null,
      };
    }

    // Check if username already exists
    const existingUsername = users.find(user => user.username === input.username);
    if (existingUsername) {
      return {
        success: false,
        message: "Este nome de usuário já está em uso",
        user: null,
      };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: input.name,
      username: input.username,
      email: input.email,
      password: input.password, // In production, hash this password
      avatar: `https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780`,
      bio: "Motociclista apaixonado por aventuras",
      motorcycle: "",
      location: "",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      message: "Conta criada com sucesso",
      user: userWithoutPassword,
    };
  });

export default registerProcedure;

// Export users array for use in other routes
export { users };