'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 text-white backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <Image src="/images/logo.png" alt="Vitality AI" width={28} height={28} />
          <span className="font-heading text-lg">Vitality AI</span>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-white mb-1 transition-transform duration-300"></span>
          <span className="block w-5 h-0.5 bg-white mb-1 transition-transform duration-300"></span>
          <span className="block w-5 h-0.5 bg-white transition-transform duration-300"></span>
        </button>

        {/* Navigation Menu */}
        <nav className={`md:flex items-center gap-6 ${isMenuOpen ? 'flex flex-col absolute top-full left-0 w-full bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-4 space-y-4 md:relative md:top-auto md:left-auto md:w-auto md:bg-transparent md:p-0 md:space-y-0' : 'hidden'}`}>
          <Link href="/" className="hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/chat" className="hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Chat</Link>
          <Link href="/history" className="hover:opacity-90" onClick={() => setIsMenuOpen(false)}>History</Link>
          <Link href="/favourites" className="hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Favorites</Link>
          <a href="#about" className="hover:opacity-90" onClick={() => setIsMenuOpen(false)}>About</a>

          <SignedOut>
            <SignInButton>
              <button className="rounded-lg border border-white/30 px-3 py-1.5 hover:bg-white/10 w-full md:w-auto text-left md:text-center" onClick={() => setIsMenuOpen(false)}>
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
