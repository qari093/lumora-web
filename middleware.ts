import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

export default function middleware(req: NextRequest) {
  // Allow unauthenticated health checks
  if (req.nextUrl.pathname === '/api/ping') {
    return NextResponse.next();
  }
  // Keep Clerk on for everything else
  return authMiddleware()(req);
}
