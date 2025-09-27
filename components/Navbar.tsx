'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 text-white backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Vitality AI" width={28} height={28} />
          <span className="font-heading text-lg">Vitality AI</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-90">Home</Link>
          <Link href="/chat" className="hover:opacity-90">Chat</Link>
          <Link href="/history" className="hover:opacity-90">History</Link>
          <Link href="/favourites" className="hover:opacity-90">Favorites</Link>
          <a href="#about" className="hover:opacity-90">About</a>

          <SignedOut>
            <SignInButton>
              <button className="rounded-lg border border-white/30 px-3 py-1.5 hover:bg-white/10">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{ elements: { userButtonPopoverCard: 'dark:bg-gray-900 dark:text-white' } }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
