export function isBehindPace(userState, timeOfDay) {
  const currentHour = timeOfDay || new Date().getHours();
  
  const expectedProgress = (currentHour - 6) / 16;
  const actualProgress = userState.consumed / userState.goal;
  
  return actualProgress < expectedProgress * 0.7;
}

export function shouldSendMorningReminder(userState, timeOfDay) {
  const currentHour = timeOfDay || new Date().getHours();
  
  if (currentHour >= 8 && currentHour <= 10) {
    return userState.consumed === 0;
  }
  
  return false;
}

export function shouldSendEveningWarning(userState, timeOfDay) {
  const currentHour = timeOfDay || new Date().getHours();
  
  if (currentHour >= 20 && currentHour <= 22) {
    const remaining = userState.goal - userState.consumed;
    return remaining > 3;
  }
  
  return false;
}
