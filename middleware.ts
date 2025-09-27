import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/chat',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/chat/stream',
  '/images(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/api')) {
    // API routes handle auth themselves
    return;
  }
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api)(.*)']
};
