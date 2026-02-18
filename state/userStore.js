const userStore = new Map();

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function getUserState(userId) {
  if (!userStore.has(userId)) {
    userStore.set(userId, {
      goal: 8,
      consumed: 0,
      history: [],
      lastReset: getTodayString()
    });
  }
  return userStore.get(userId);
}

export function addWater(userId, glasses) {
  const state = getUserState(userId);
  state.consumed += glasses;
  return {
    goal: state.goal,
    consumed: state.consumed,
    remaining: Math.max(0, state.goal - state.consumed)
  };
}

export function removeWater(userId, glasses) {
  const state = getUserState(userId);
  state.consumed = Math.max(0, state.consumed - glasses);
  return {
    goal: state.goal,
    consumed: state.consumed,
    remaining: Math.max(0, state.goal - state.consumed)
  };
}

export function getWaterStatus(userId) {
  const state = getUserState(userId);
  return {
    goal: state.goal,
    consumed: state.consumed,
    remaining: Math.max(0, state.goal - state.consumed)
  };
}

export function setWaterGoal(userId, goal) {
  const state = getUserState(userId);
  state.goal = goal;
  return {
    goal: state.goal,
    consumed: state.consumed,
    remaining: Math.max(0, state.goal - state.consumed)
  };
}

export function getAllUsers() {
  return Array.from(userStore.keys());
}

export function resetUserDay(userId) {
  const state = getUserState(userId);
  const today = getTodayString();
  
  if (state.lastReset !== today) {
    state.history.push({
      date: state.lastReset,
      goal: state.goal,
      consumed: state.consumed,
      success: state.consumed >= state.goal
    });
    state.consumed = 0;
    state.lastReset = today;
  }
}
