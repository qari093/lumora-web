import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/api/ping'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next|api/ping).*)'],
};
