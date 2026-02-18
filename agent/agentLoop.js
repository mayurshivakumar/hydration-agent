import OpenAI from 'openai';
import { systemPrompt } from './systemPrompt.js';
import { toolDefinitions, executeTool } from './tools.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MAX_ITERATIONS = 10;

export async function runAgent(userId, userMessage) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages,
      tools: toolDefinitions,
      tool_choice: 'auto'
    });

    const assistantMessage = response.choices[0].message;
    messages.push(assistantMessage);

    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return assistantMessage.content;
    }

    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;
      let args;
      
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch (error) {
        console.error('Failed to parse tool arguments:', error);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: 'Invalid arguments format' })
        });
        continue;
      }

      args.userId = userId;

      let result;
      try {
        result = executeTool(toolName, args);
      } catch (error) {
        console.error('Tool execution error:', error);
        result = { error: error.message };
      }

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }
  }

  return 'I apologize, but I reached the maximum number of processing steps. Please try rephrasing your request.';
}
