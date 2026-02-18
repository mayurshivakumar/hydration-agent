import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hydration Agent API',
      version: '1.0.0',
      description: 'AI-powered hydration tracking chat agent with GPT-4 tool calling. Track water intake, set goals, and get personalized hydration recommendations through natural language conversations.',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Chat',
        description: 'Hydration agent chat endpoints for natural language interaction'
      },
      {
        name: 'Health',
        description: 'Health check and monitoring endpoints'
      }
    ]
  },
  apis: ['./server.js']
};

export const swaggerSpec = swaggerJsdoc(options);
