import { z } from "zod";
import { protectedProcedure } from "../../../create-context";

// Mock notifications data
const notificationsData: Record<string, any[]> = {};

export const getNotificationsProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(({ input }) => {
    return {
      success: true,
      notifications: notificationsData[input.userId] || [],
    };
  });

export const markNotificationReadProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
    notificationId: z.string(),
  }))
  .mutation(({ input }) => {
    if (notificationsData[input.userId]) {
      const notification = notificationsData[input.userId].find(n => n.id === input.notificationId);
      if (notification) {
        notification.read = true;
      }
    }
    
    return {
      success: true,
      message: "Notificação marcada como lida",
    };
  });

export const clearNotificationsProcedure = protectedProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .mutation(({ input }) => {
    notificationsData[input.userId] = [];
    
    return {
      success: true,
      message: "Notificações limpas",
    };
  });

export default getNotificationsProcedure;