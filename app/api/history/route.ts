import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbAdmin } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const { userId } = await auth();
    console.log('GET /api/history - userId:', userId);
    if (!userId) return NextResponse.json({ entries: [] }, { status: 200 });

    const snap = await dbAdmin
      .collection('chatMessages')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const entries = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        sessionId: data.sessionId ?? null,
        role: data.role as 'user' | 'ai',
        text: data.text ?? '',
        createdAt: data.createdAt?.toMillis?.() ?? null,
      };
    });
    console.log('GET /api/history - entries count:', entries.length, 'snap.empty:', snap.empty);
    return NextResponse.json({ entries }, { status: 200 });
  } catch (e: any) {
    console.error('History GET error:', e?.message || e);
    return NextResponse.json({ entries: [] }, { status: 200 });
  }
}
