import { createTRPCRouter } from './create-context';
import { hiProcedure } from './routes/example/hi/route';
import { registerProcedure } from './routes/auth/register/route';
import { loginProcedure } from './routes/auth/login/route';
import { searchUsersProcedure } from './routes/users/search/route';
import { getProfileProcedure, updateProfileProcedure } from './routes/users/profile/route';
import { listCommunitiesProcedure, joinCommunityProcedure, createCommunityProcedure } from './routes/communities/list/route';
import { listEventsProcedure, createEventProcedure } from './routes/events/list/route';
import { getProgressProcedure, updateProgressProcedure } from './routes/achievements/progress/route';
import { getNotificationsProcedure, markNotificationReadProcedure } from './routes/achievements/notifications/route';

export const appRouter = createTRPCRouter({
  example: {
    hi: hiProcedure,
  },
  auth: {
    register: registerProcedure,
    login: loginProcedure,
  },
  users: {
    search: searchUsersProcedure,
    profile: getProfileProcedure,
    updateProfile: updateProfileProcedure,
  },
  communities: {
    list: listCommunitiesProcedure,
    join: joinCommunityProcedure,
    create: createCommunityProcedure,
  },
  events: {
    list: listEventsProcedure,
    create: createEventProcedure,
  },
  achievements: {
    progress: getProgressProcedure,
    updateProgress: updateProgressProcedure,
    notifications: getNotificationsProcedure,
    markNotificationRead: markNotificationReadProcedure,
  },
});

export type AppRouter = typeof appRouter;
