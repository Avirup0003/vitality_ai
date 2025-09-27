# TODO: Fix Favorites Adding and Empty History Issues

## Steps to Complete:

- [ ] Edit `vitality-ai/app/chat/page.tsx`: Import `useUser` from '@clerk/nextjs'. Use `const { isLoaded, isSignedIn } = useUser();` to check auth. Hide favorite button if !isSignedIn (show "Sign in to favorite" message instead). In sendMessage, pass userId if signed in to body for chat API (to ensure saves with userId, even though public).
- [ ] Edit `vitality-ai/app/favourites/page.tsx`: Import `useUser` and `RedirectToSignIn` from '@clerk/nextjs'. If !isSignedIn, show "Sign in to view favorites" and use RedirectToSignIn(). Fetch only if signed in.
- [ ] Edit `vitality-ai/app/history/page.tsx`: Import useUser and RedirectToSignIn, show sign-in prompt if !isSignedIn, fetch only if signed in.
- [ ] Edit `vitality-ai/app/api/chat/stream/route.ts` (minor): In body, accept optional userId from client, use it if provided (fallback to safeAuth() for server-side). This ensures messages save with userId even for public route.
- [ ] Test: Sign in, send chat message (verify saves to Firestore with userId), click favorite (verify adds to 'favourites'), check /favourites shows items, /history shows messages. If not signed in, buttons hidden/redirects work, no empty lists.
- [ ] Run `npm run dev` to test.

# TODO: Fix Images Not Showing in About Section

## Steps to Complete:

- [x] Edit `vitality-ai/components/AboutSection.tsx`: Replace Next.js Image components with standard <img> tags to bypass optimization issues.
- [x] Verify changes: Relaunch browser at http://localhost:3000, scroll to about section, confirm images load.
- [ ] If images still fail, suggest replacing corrupted files in public/images/.
- [x] Update TODO.md to mark complete.
