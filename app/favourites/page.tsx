'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { RedirectToSignIn } from '@clerk/nextjs';

type Fav = { id: string; text: string; sessionId?: string; createdAt?: any };

export default function FavouritesPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState<Fav[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      try {
        const res = await fetch('/api/favourites', { cache: 'no-store' });
        const data = await res.json();
        console.log('GET /api/favourites response:', data);
        const favs = Array.isArray(data?.favourites) ? data.favourites : [];
        console.log('Parsed favourites:', favs);
        setItems(favs);
      } catch (e) {
        console.error('Load favourites failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  if (!isLoaded) return <p>Loading...</p>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl md:text-3xl mb-6 text-primary">Favorites</h1>
      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p className="text-gray-500">No favorites yet.</p>}

      <div className="space-y-4">
        {items.map((f) => (
          <div key={f.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 border-gray-200 rounded-xl p-4">
            <p className="whitespace-pre-wrap">{f.text}</p>
            {f.sessionId ? <p className="text-sm text-gray-500 mt-2">Session: {f.sessionId}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
