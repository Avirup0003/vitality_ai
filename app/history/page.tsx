'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { RedirectToSignIn } from '@clerk/nextjs';

type Entry = { id: string; sessionId: string | null; role: 'user' | 'ai'; text: string; createdAt: number | null };

export default function HistoryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      try {
        const res = await fetch('/api/history', { cache: 'no-store' });
        const data = await res.json();
        console.log('GET /api/history response:', data);
        const entries = Array.isArray(data?.entries) ? data.entries : [];
        console.log('Parsed entries:', entries);
        setItems(entries);
      } catch (e) {
        console.error('Load history failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  if (!isLoaded) return <p>Loading...</p>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl md:text-3xl mb-6 text-primary">History</h1>
      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p className="text-gray-500">No chat messages yet.</p>}

      <div className="space-y-4">
        {items.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-4 ${
              m.role === 'user'
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {m.role === 'user' ? 'You' : 'AI'}
              {m.sessionId ? ` • Session: ${m.sessionId}` : ''}
              {m.createdAt ? ` • ${new Date(m.createdAt).toLocaleString()}` : ''}
            </div>
            <div className="whitespace-pre-wrap">{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
