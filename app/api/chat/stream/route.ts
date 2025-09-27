import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { MODEL_CANDIDATES, openai } from '@/lib/ai/openai';
import { dbAdmin, AdminTimestamp } from '@/lib/firebaseAdmin';

type ChatCompletionMessageParam = { role: 'system' | 'user' | 'assistant'; content: string };

export const runtime = 'nodejs';

type HistoryMsg = { role: 'user' | 'ai'; text: string };

const ok = (v: unknown) => typeof v === 'string' && v.trim().length > 0;

export async function POST(req: Request) {
  if (!ok(process.env.OPENAI_API_KEY)) {
    return NextResponse.json({ error: 'Server missing OpenAI API key' }, { status: 500 });
  }

  try {
    const { userId } = await safeAuth();
    console.log('POST /api/chat/stream - server userId:', userId);
    const body = await req.json().catch(() => ({}));
    const clientUserId = body?.userId;
    const effectiveUserId = clientUserId || (userId ?? null);
    console.log('POST /api/chat/stream - effectiveUserId:', effectiveUserId);
    const question: string = body?.question ?? '';
    const history: HistoryMsg[] = Array.isArray(body?.history) ? body.history : [];
    const clientSessionId: string | undefined = body?.sessionId;

    if (!ok(question)) {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 });
    }

    // Session id
    const sessionId = clientSessionId || crypto.randomUUID();

    // Ensure a session doc (best-effort)
    try {
      await dbAdmin.collection('chatSessions').doc(sessionId).set(
        { id: sessionId, userId: effectiveUserId, createdAt: AdminTimestamp.now() },
        { merge: true }
      );
      console.log('POST /api/chat/stream - session doc set for:', sessionId);
    } catch (e) {
      console.error('(non-fatal) set chatSessions failed:', (e as any)?.message || e);
    }

    // Save the user message (best-effort)
    try {
      const userDocRef = await dbAdmin.collection('chatMessages').add({
        sessionId,
        userId: effectiveUserId,
        role: 'user',
        text: question,
        createdAt: AdminTimestamp.now(),
      });
      console.log('POST /api/chat/stream - user message added:', userDocRef.id);
    } catch (e) {
      console.error('(non-fatal) add user message failed:', (e as any)?.message || e);
    }

    // System prompt
    const instructionText = `You are Vitality AI — a friendly wellness assistant.
Offer general information on lifestyle (diet, sleep, stress, fitness) and safety-first guidance.
Do NOT diagnose or prescribe. Encourage professional care for serious symptoms.
Keep answers concise and readable.`;

    // History mapping for OpenAI
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: instructionText },
      ...history.map((m): ChatCompletionMessageParam => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      })),
      { role: 'user', content: question },
    ];

    // Try models with retry logic
    let lastErr: unknown;
    for (const name of MODEL_CANDIDATES) {
      const maxAttempts = 3;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const stream = await openai.chat.completions.create({
            model: name,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 768,
          });

          const { readable, writable } = new TransformStream();

          (async () => {
            const writer = writable.getWriter();
            const enc = new TextEncoder();
            let full = '';

            try {
              for await (const chunk of stream) {
                const part = chunk.choices[0]?.delta?.content ?? '';
                full += part;
                await writer.write(enc.encode(part));
              }
            } catch (e) {
              console.error('OpenAI stream error:', (e as any)?.message || e);
              await writer.write(enc.encode('\n\n(Streaming ended unexpectedly.)'));
            } finally {
              await writer.close();

              // Save AI message
              try {
                const aiDocRef = await dbAdmin.collection('chatMessages').add({
                  sessionId,
                  userId: effectiveUserId,
                  role: 'ai',
                  text: full,
                  createdAt: AdminTimestamp.now(),
                });
                console.log('POST /api/chat/stream - AI message added:', aiDocRef.id, 'full length:', full.length);
              } catch (e) {
                console.error('(non-fatal) add ai message failed:', (e as any)?.message || e);
              }
            }
          })();

          return new Response(readable, {
            status: 200,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'no-cache',
              'X-Session-Id': sessionId,
            },
          });
        } catch (err) {
          lastErr = err;
          console.warn(`Model ${name} attempt ${attempt} failed; ${attempt < maxAttempts ? 'retrying' : 'trying next model'}.`, (err as any)?.message || err);
          if (attempt < maxAttempts) {
            // Exponential backoff: 1s, 2s, 3s
            const delay = 1000 * attempt;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    }

    console.error('All OpenAI models failed after retries:', lastErr);
    return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again later.' }, { status: 503 });
  } catch (e: any) {
    console.error('API error:', e?.message || e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function safeAuth() {
  try {
    return await auth();
  } catch {
    return { userId: null } as any;
  }
}
