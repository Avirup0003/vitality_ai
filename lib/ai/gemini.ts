import { GoogleGenerativeAI } from '@google/generative-ai';

const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
export const genAI = new GoogleGenerativeAI(key);

// Use AI Studio public models only
export const MODEL_CANDIDATES = [
  'gemini-1.5-flash',     // primary
  'gemini-1.5-pro',       // pro fallback
  'gemini-pro',           // stable legacy fallback
];

export function getModel(name: string) {
  return genAI.getGenerativeModel({ model: name });
}
