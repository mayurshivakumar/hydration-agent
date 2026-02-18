# Hydration Agent Implementation Plan

## 1. Objective

Build a hydration tracking chat agent that:

- Logs water intake in glasses
- Tracks daily progress vs goal
- Resets at midnight
- Uses GPT-4.1 with tool calling
- Runs on Node.js + Express
- Stores data in memory (for now)
- Supports adaptive daily goals

---

## 2. Tech Stack

- Node.js (ESM)
- Express
- OpenAI Responses API
- In-memory Map storage
- Interval-based workers

---

## 3. Project Structure

hydration-agent/

- server.js
- agent/
  - systemPrompt.js
  - tools.js
  - agentLoop.js
- state/
  - userStore.js
  - resetWorker.js
- logic/
  - adaptiveGoal.js
  - reminderEngine.js
- plan.md

---

## 4. Hydration Agent Behavior

The agent must:

1. Interpret hydration-related messages
2. Convert units to glasses (1 glass = 250ml default)
3. Call tools when logging/removing water
4. Confirm totals after every update
5. Answer status questions
6. Allow goal updates
7. Never invent numbers without tool state

---

## 5. OpenAI Configuration

### Model
gpt-4.1

### API Style
Responses API

### System Prompt Requirements

The system prompt must instruct the model to:

- Use tools for any state changes
- Normalize water units into glasses
- Confirm totals after updates
- Ask clarification if amount missing
- Stay concise and numeric
- Never fabricate stored values

---

## 6. Tool Definitions

### addWater
inputs: userId, glasses  
effect: increment consumed  
returns: updated state  

### removeWater
inputs: userId, glasses  
effect: decrement consumed (minimum 0)  
returns: updated state  

### getWaterStatus
inputs: userId  
returns: goal, consumed, remaining  

### setWaterGoal
inputs: userId, goal  
returns: updated state  

---

## 7. Agent Loop Requirements

The coding agent must implement:

1. Send user message + system prompt to OpenAI
2. Detect tool calls in the response
3. Execute tool handler
4. Send tool result back to model
5. Repeat until a text response is produced
6. Return final assistant reply

The loop must support:

- multiple tool calls in one turn
- JSON argument parsing
- safe fallback if tool name missing
- prevention of infinite loops (max iterations)

---

## 8. In-Memory State Store

Each user must have:

{
  goal: number
  consumed: number
  history: array
  lastReset: dateString
}

State must be auto-created on first request.

---

## 9. Midnight Reset Worker

Runs every minute.

For each user:

IF today != lastReset
  push history record
  consumed = 0
  lastReset = today

History record:

{
  date
  goal
  consumed
  success: consumed >= goal
}

---

## 10. Adaptive Goal Logic

Create function:

computeAdaptiveGoal(userState, signals)

Signals may include:

temperature  
activityLevel  
recentSuccessRate  
wakeHours  

Rules:

baseline = 8  
+2 if hot weather  
+1 moderate activity  
+2 heavy activity  
+1 if successRate > 80%  
-1 if successRate < 40%  
scale by wakeHours / 16  
clamp between 5 and 14  

Return an integer goal.

---

## 11. Express API

### POST /chat

Input:

{
  "userId": "string",
  "message": "string"
}

Flow:

1. Run agent loop
2. Return assistant text

Output:

{
  "reply": "string"
}

---

## 12. Reminder Engine (Stub)

Create module that evaluates:

isBehindPace(userState, timeOfDay)  
shouldSendMorningReminder(userState, timeOfDay)  
shouldSendEveningWarning(userState, timeOfDay)  

Do not implement notifications yet.  
Return boolean decisions only.

---

## 13. Success Criteria

The implementation is correct if:

- Agent logs water via natural language
- Status queries work
- Goal updates persist
- Midnight reset works
- Multiple users supported
- Tool calls handled correctly
- GPT-4.1 responses drive behavior

---

## 14. Nice-to-Have (Do Not Block MVP)

- timezone per user
- persistent database layer
- streaming responses
- UI quick buttons
- hydration streak scoring

---
