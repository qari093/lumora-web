import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Hub = {
  id: string;
  title: string;
  slug: string;
  live: boolean;
  order: number;
  href?: string;
  icon?: string;
};

function requestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 10)}`;
}
function ratelimitHeaders() {
  const now = Math.floor(Date.now() / 1000);
  return {
    'x-ratelimit-limit': '60',
    'x-ratelimit-remaining': '59',
    'x-ratelimit-reset': String(now + 60),
  };
}

export async function GET() {
  const rid = requestId();
  try {
    const hubs: Hub[] = [
      {
        id: 'hub_live',
        title: 'Live',
        slug: 'live',
        live: true,
        order: 1,
        href: '/live',
        icon: 'live',
      },
      {
        id: 'hub_gmar',
        title: 'GMAR',
        slug: 'gmar',
        live: false,
        order: 2,
        href: '/gmar',
        icon: 'gmar',
      },
      {
        id: 'hub_nexa',
        title: 'NEXA',
        slug: 'nexa',
        live: false,
        order: 3,
        href: '/nexa',
        icon: 'nexa',
      },
      {
        id: 'hub_music',
        title: 'Music',
        slug: 'music',
        live: false,
        order: 4,
        href: '/music',
        icon: 'music',
      },
      {
        id: 'hub_movies',
        title: 'Movies',
        slug: 'movies',
        live: false,
        order: 5,
        href: '/cineverse',
        icon: 'movies',
      },
    ];
    const body = { ok: true, ts: Date.now(), requestId: rid, hubs, count: hubs.length };
    const res = NextResponse.json(body, { status: 200 });
    res.headers.set('x-request-id', rid);
    res.headers.set('x-lumora-live', 'portal-hubs-v1');
    for (const [k, v] of Object.entries(ratelimitHeaders())) res.headers.set(k, v);
    res.headers.set('cache-control', 'no-store');
    return res;
  } catch (e: any) {
    const msg = typeof e?.message === 'string' ? e.message : 'internal_error';
    const body = {
      ok: false,
      ts: Date.now(),
      requestId: rid,
      error: { code: 'INTERNAL', message: msg },
    };
    const res = NextResponse.json(body, { status: 500 });
    res.headers.set('x-request-id', rid);
    for (const [k, v] of Object.entries(ratelimitHeaders())) res.headers.set(k, v);
    res.headers.set('cache-control', 'no-store');
    return res;
  }
}
