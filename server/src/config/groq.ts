import Groq from 'groq-sdk';
import { env } from './env';

export const groq = new Groq({
  apiKey: env.groqApiKey,
});

export const getGroqCompletion = async (prompt: string, jsonMode = false) => {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: env.groqModel,
    response_format: jsonMode ? { type: 'json_object' } : undefined,
    temperature: 0.1, // Keep it deterministic for planning
  });

  return response.choices[0].message.content;
};
