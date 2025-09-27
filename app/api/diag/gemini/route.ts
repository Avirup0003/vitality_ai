import { NextResponse } from 'next/server';
import { MODEL_CANDIDATES, getModel } from '@/lib/ai/gemini';

export async function GET() {
  const tried: { model: string; ok: boolean; message?: string }[] = [];
  for (const name of MODEL_CANDIDATES) {
    try {
      const model = getModel(name);
      const r = await model.generateContent('Say "pong".');
      const txt = r.response.text();
      tried.push({ model: name, ok: true, message: txt.slice(0, 100) });
      return NextResponse.json({ ok: true, model: name, preview: txt });
    } catch (e: any) {
      tried.push({ model: name, ok: false, message: e?.message || String(e) });
    }
  }
  return NextResponse.json({ ok: false, tried }, { status: 500 });
}
