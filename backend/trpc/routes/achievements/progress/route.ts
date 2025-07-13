import { z } from "zod";
import { protectedProcedure } from "../../../create-context";

// Mock progress data
const progressData: Record<string, any> = {};

export const getProgressProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(({ input }) => {
    return {
      success: true,
      progress: progressData[input.userId] || {},
    };
  });

export const updateProgressProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    achievementId: z.string(),
    progress: z.number(),
  }))
  .mutation(({ input }) => {
    if (!progressData[input.userId]) {
      progressData[input.userId] = {};
    }
    
    progressData[input.userId][input.achievementId] = input.progress;
    
    return {
      success: true,
      message: "Progresso atualizado",
    };
  });

export const addAchievementProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    achievementId: z.string(),
  }))
  .mutation(({ input }) => {
    return {
      success: true,
      message: "Conquista adicionada",
    };
  });

export default getProgressProcedure;