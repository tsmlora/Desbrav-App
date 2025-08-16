import { router } from './create-context';
import { hiProcedure } from './routes/example/hi/route';
import { registerProcedure } from './routes/auth/register/route';
import { loginProcedure } from './routes/auth/login/route';
import { devSetupProcedure } from './routes/auth/dev-setup/route';
import { searchUsersProcedure } from './routes/users/search/route';
import { getProfileProcedure, updateProfileProcedure } from './routes/users/profile/route';
import { listCommunitiesProcedure } from './routes/communities/list/route';
import { joinCommunityProcedure } from './routes/communities/join/route';
import { createCommunityProcedure } from './routes/communities/create/route';
import { listEventsProcedure } from './routes/events/list/route';
import { createEventProcedure } from './routes/events/create/route';
import { 
  getProgressProcedure, 
  updateProgressProcedure, 
  addAchievementProcedure 
} from './routes/achievements/progress/route';
import { 
  getNotificationsProcedure, 
  markNotificationReadProcedure, 
  clearNotificationsProcedure 
} from './routes/achievements/notifications/route';

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
  auth: router({
    register: registerProcedure,
    login: loginProcedure,
    devSetup: devSetupProcedure,
  }),
  users: router({
    search: searchUsersProcedure,
    getProfile: getProfileProcedure,
    updateProfile: updateProfileProcedure,
  }),
  communities: router({
    list: listCommunitiesProcedure,
    join: joinCommunityProcedure,
    create: createCommunityProcedure,
  }),
  events: router({
    list: listEventsProcedure,
    create: createEventProcedure,
  }),
  achievements: router({
    getProgress: getProgressProcedure,
    updateProgress: updateProgressProcedure,
    addAchievement: addAchievementProcedure,
    getNotifications: getNotificationsProcedure,
    markNotificationRead: markNotificationReadProcedure,
    clearNotifications: clearNotificationsProcedure,
  }),
});

export type AppRouter = typeof appRouter;