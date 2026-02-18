import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import { runAgent } from './agent/agentLoop.js';
import { startResetWorker } from './state/resetWorker.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Hydration Agent API Docs'
}));

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Send a message to the hydration agent
 *     description: Interact with the AI hydration agent using natural language. The agent can log water intake, check status, update goals, and more.
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Unique identifier for the user
 *                 example: user123
 *               message:
 *                 type: string
 *                 description: Natural language message about water intake
 *                 example: I drank 2 glasses of water
 *           examples:
 *             logWater:
 *               summary: Log water intake
 *               value:
 *                 userId: user123
 *                 message: I drank 500ml of water
 *             checkStatus:
 *               summary: Check water status
 *               value:
 *                 userId: user123
 *                 message: How much water have I had today?
 *             setGoal:
 *               summary: Set daily goal
 *               value:
 *                 userId: user123
 *                 message: Set my goal to 10 glasses
 *             removeWater:
 *               summary: Remove water
 *               value:
 *                 userId: user123
 *                 message: Remove 1 glass
 *     responses:
 *       200:
 *         description: Successful response from the agent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *                   example: Great! I've logged 2 glasses. You've consumed 2/8 glasses today. Keep it up!
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields userId and message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to process message
 *                 details:
 *                   type: string
 *                   example: OpenAI API error
 */
app.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId and message' 
      });
    }

    const reply = await runAgent(userId, message);

    res.json({ reply });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the service is running and responsive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-18T17:50:00.000Z
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Hydration Agent server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Chat endpoint: POST http://localhost:${PORT}/chat`);
  
  startResetWorker();
});
