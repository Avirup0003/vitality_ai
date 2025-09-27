import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dbAdmin, AdminTimestamp } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    console.log('POST /api/favourites - userId:', userId);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sessionId, text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 });

    const docRef = await dbAdmin.collection('favourites').add({
      userId,
      sessionId: sessionId ?? null,
      text,
      createdAt: AdminTimestamp.now(),
    });
    console.log('POST /api/favourites - added doc:', docRef.id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Fav POST error:', e?.message || e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    console.log('GET /api/favourites - userId:', userId);
    if (!userId) return NextResponse.json({ favourites: [] }, { status: 200 });

    const snap = await dbAdmin
      .collection('favourites')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const favourites = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    console.log('GET /api/favourites - favourites count:', favourites.length, 'snap.empty:', snap.empty);
    return NextResponse.json({ favourites });
  } catch (e: any) {
    console.error('Fav GET error:', e?.message || e);
    return NextResponse.json({ favourites: [] }, { status: 200 });
  }
}
