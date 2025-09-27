'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

type Message = { role: 'user' | 'ai'; text: string };

export default function ChatPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I’m Vitality AI. Ask about healthy lifestyle, sleep, stress, or exercise. (Not medical advice.)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input };
    const aiMsg: Message = { role: 'ai', text: '' };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setLoading(true);

    try {
      const body = {
        sessionId,
        question: userMsg.text,
        history: messages.slice(1),
        userId: isSignedIn ? user?.id : undefined,
      };
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const sid = res.headers.get('X-Session-Id');
      if (sid && sid !== sessionId) setSessionId(sid);

      if (!res.ok || !res.body) {
        throw new Error(await res.text());
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'ai', text: aiText };
          return copy;
        });
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'ai', text: '❌ Sorry, something went wrong.' };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const addFavourite = async (msg: Message) => {
    try {
      const res = await fetch('/api/favourites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, text: msg.text }),
      });
      if (!res.ok) {
        console.error('Fav failed:', await res.text());
      }
    } catch (e) {
      console.error('Fav error:', e);
    }
  };

  return (
    <section>
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-brand-gradientStart to-brand-gradientEnd p-[1px] shadow-lg">
        <div className="rounded-3xl bg-white dark:bg-gray-900">
          <div className="px-6 py-5 border-b border-white/10">
            <h1 className="font-heading text-2xl md:text-3xl text-primary">Chat with Vitality AI</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">General information only — not medical advice.</p>
          </div>

          <div ref={scrollerRef} className="px-4 md:px-6 py-6 h-[60vh] overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm border
                  ${m.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="text-xs opacity-70">{m.role === 'user' ? 'You' : 'AI'}</div>
                    {m.role === 'ai' && m.text && (
                      <>
                        {(!isLoaded || !isSignedIn) ? (
                          <span className="ml-auto text-xs text-gray-500">Sign in to favorite</span>
                        ) : (
                          <button
                            className="ml-auto text-xs rounded px-2 py-1 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => addFavourite(m)}
                            title="Add to Favorites"
                          >
                            ♥ Favorite
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                </div>
              </div>
            ))}
            {loading && <p className="text-gray-500 px-6">AI is typing…</p>}
          </div>

          <div className="px-4 md:px-6 pb-6">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type your health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="rounded-xl bg-primary hover:bg-primary/90 text-white px-4 min-w-24"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
