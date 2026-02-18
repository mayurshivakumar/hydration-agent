import * as userStore from '../state/userStore.js';

export const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'addWater',
      description: 'Add water intake for a user. Increments the consumed amount.',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'The user ID'
          },
          glasses: {
            type: 'number',
            description: 'Number of glasses to add (1 glass = 250ml)'
          }
        },
        required: ['userId', 'glasses']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'removeWater',
      description: 'Remove water intake for a user. Decrements the consumed amount (minimum 0).',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'The user ID'
          },
          glasses: {
            type: 'number',
            description: 'Number of glasses to remove'
          }
        },
        required: ['userId', 'glasses']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getWaterStatus',
      description: 'Get the current water intake status for a user.',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'The user ID'
          }
        },
        required: ['userId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'setWaterGoal',
      description: 'Set or update the daily water goal for a user.',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'The user ID'
          },
          goal: {
            type: 'number',
            description: 'Daily goal in glasses'
          }
        },
        required: ['userId', 'goal']
      }
    }
  }
];

export function executeTool(toolName, args) {
  switch (toolName) {
    case 'addWater':
      return userStore.addWater(args.userId, args.glasses);
    
    case 'removeWater':
      return userStore.removeWater(args.userId, args.glasses);
    
    case 'getWaterStatus':
      return userStore.getWaterStatus(args.userId);
    
    case 'setWaterGoal':
      return userStore.setWaterGoal(args.userId, args.goal);
    
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
