export function computeAdaptiveGoal(userState, signals = {}) {
  const {
    temperature = 'normal',
    activityLevel = 'moderate',
    wakeHours = 16
  } = signals;

  let goal = 8;

  if (temperature === 'hot') {
    goal += 2;
  }

  if (activityLevel === 'moderate') {
    goal += 1;
  } else if (activityLevel === 'heavy') {
    goal += 2;
  }

  if (userState.history.length >= 7) {
    const recentHistory = userState.history.slice(-7);
    const successCount = recentHistory.filter(day => day.success).length;
    const successRate = successCount / recentHistory.length;

    if (successRate > 0.8) {
      goal += 1;
    } else if (successRate < 0.4) {
      goal -= 1;
    }
  }

  const wakeHoursFactor = wakeHours / 16;
  goal = Math.round(goal * wakeHoursFactor);

  goal = Math.max(5, Math.min(14, goal));

  return goal;
}
