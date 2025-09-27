import OpenAI from 'openai';

const key = process.env.OPENAI_API_KEY || '';
export const openai = new OpenAI({ apiKey: key });

// Use reliable OpenAI models
export const MODEL_CANDIDATES = [
  'gpt-3.5-turbo',  // primary, cost-effective
  'gpt-4o-mini',    // faster fallback
];

export function getModel(name: string) {
  return name;  // OpenAI uses model name directly in create call
}
