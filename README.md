# Hydration Agent

A hydration tracking chat agent powered by GPT-4.1 with tool calling capabilities.

## Features

- Natural language water intake logging
- Daily goal tracking with adaptive adjustments
- Automatic midnight reset
- Multi-user support
- In-memory state management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_key_here
```

4. Start the server:
```bash
npm start
```

## API Documentation

Interactive API documentation is available via **Swagger UI**:

**http://localhost:3000/api-docs**

The Swagger UI provides:
-  Complete API endpoint documentation
-  Interactive "Try it out" functionality
-  Request/response schemas with examples
-  Live testing directly from your browser

### Using Swagger UI

1. Start the server: `npm start`
2. Open browser: http://localhost:3000/api-docs
3. Click on any endpoint (e.g., POST /chat)
4. Click "Try it out"
5. Fill in the request body
6. Click "Execute" to send a real request
7. See the live response from the agent

## API Usage

### POST /chat

Send a message to the hydration agent:

```json
{
  "userId": "user123",
  "message": "I drank 2 glasses of water"
}
```

Response:
```json
{
  "reply": "Great! I've logged 2 glasses. You've consumed 2/8 glasses today. Keep it up!"
}
```

## Example Conversations

- "I drank 500ml of water"
- "How much water have I had today?"
- "Set my goal to 10 glasses"
- "Remove 1 glass"

## Testing

Run the test script (requires server to be running):

```bash
# Terminal 1: Start the server
npm start

# Terminal 2: Run tests
node test.js
```

## Project Structure

```
hydration-agent/
├── server.js              # Express server with /chat endpoint
├── swagger.js             # Swagger/OpenAPI configuration
├── agent/
│   ├── agentLoop.js      # OpenAI agent loop with tool calling
│   ├── systemPrompt.js   # GPT-4 system instructions
│   └── tools.js          # Tool definitions and handlers
├── state/
│   ├── userStore.js      # In-memory user state management
│   └── resetWorker.js    # Midnight reset worker
├── logic/
│   ├── adaptiveGoal.js   # Adaptive goal calculation
│   └── reminderEngine.js # Reminder logic (stub)
└── test.js               # Test script
```
