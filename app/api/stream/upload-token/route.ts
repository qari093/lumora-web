// app/api/stream/upload-token/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// POST { ownerId: string }
export async function POST(req: Request) {
  try {
    const { ownerId } = await req.json().catch(() => ({}));
    if (!ownerId) {
      return NextResponse.json({ ok: false, error: 'ownerId is required' }, { status: 400 });
    }

    const accountId = process.env.CF_ACCOUNT_ID;
    const token = process.env.CF_API_TOKEN;
    if (!accountId || !token) {
      return NextResponse.json({ ok: false, error: 'Missing CF_ACCOUNT_ID/CF_API_TOKEN' }, { status: 500 });
    }

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxDurationSeconds: 600,
        creator: ownerId,
      }),
    });

    const cf = await res.json();
    if (!cf?.success) {
      return NextResponse.json({ ok: false, error: 'Cloudflare API failed', cf }, { status: 502 });
    }

    // cf.result.uploadURL is the one-time direct upload URL
    return NextResponse.json({
      ok: true,
      ownerId,
      uploadURL: cf.result?.uploadURL,
      cfResult: cf.result,
      requestId: Math.random().toString(36).slice(2),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}