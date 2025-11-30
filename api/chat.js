
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { SYSTEM_DIAGNOSIS } from '../src/lib/systemPrompt';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  const systemPrompt = `Você é o Arquiteto e Gerente Virtual do ERP D.S. Engenharia. Você ajuda o Tiago e o Daniel. Use o contexto técnico abaixo para responder dúvidas sobre o sistema: ${SYSTEM_DIAGNOSIS}`;

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: systemPrompt,
    messages,
  });

  return result.toAIStreamResponse();
}
