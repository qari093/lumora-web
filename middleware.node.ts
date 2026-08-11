import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clientIp, takeToken } from './lib/ratelimit';

const RATE_LIMIT_CAPACITY = 120;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function middleware(req: NextRequest) {
  const ip = clientIp(req);
  const rate = takeToken(`middleware:${ip}`, RATE_LIMIT_CAPACITY, RATE_LIMIT_WINDOW_MS);

  if (!rate.ok) {
    return new NextResponse('Rate limit', {
      status: 429,
      headers: {
        'retry-after': String(rate.waitSec),
      },
    });
  }

  const res = NextResponse.next();

  const hasCookie = req.cookies.get('pulse_lang');
  if (!hasCookie) {
    const al = req.headers.get('accept-language') || 'en';
    const guessed = (al.split(',')[0] || 'en').slice(0, 2);
    res.cookies.set('pulse_lang', guessed, {
      path: '/',
      maxAge: 31_536_000,
    });
  }

  return res;
}

export const config = { matcher: ['/api/:path*'] };
