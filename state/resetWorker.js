import { getAllUsers, resetUserDay } from './userStore.js';

const RESET_CHECK_INTERVAL = 60 * 1000;

export function startResetWorker() {
  setInterval(() => {
    const users = getAllUsers();
    
    for (const userId of users) {
      try {
        resetUserDay(userId);
      } catch (error) {
        console.error(`Failed to reset day for user ${userId}:`, error);
      }
    }
  }, RESET_CHECK_INTERVAL);
  
  console.log('Reset worker started - checking every minute');
}
