import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/api/ping',
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;
  // All other routes remain protected
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/(api|trpc)(.*)'],
};
