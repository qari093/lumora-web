import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Public endpoints that should bypass auth entirely
  publicRoutes: ['/api/ping'],
});

// Apply middleware to app + API routes, but skip static files and _next
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/(api|trpc)(.*)'],
};
