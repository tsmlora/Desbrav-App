import { publicProcedure } from "../../../create-context";

// Simple test query without input
export const hiProcedure = publicProcedure
  .query(() => {
    console.log('Hi procedure called successfully');
    return {
      greeting: "Hello from tRPC!",
      timestamp: new Date().toISOString(),
      status: "Backend is working!"
    };
  });

export default hiProcedure;