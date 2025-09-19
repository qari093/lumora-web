import { NextResponse } from 'next/server';
import type { PublishRequest, PublishResponse } from '@/types/labs';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<PublishRequest>;
  if (!body || !body.effects || typeof body.earnOnShare !== 'boolean' || !body.postTitle) {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
  }
  const earned = body.earnOnShare ? 2 : 0;
  const res: PublishResponse = { ok: true, postId: 'post_'+Date.now().toString(36), earned, effects: body.effects };
  return NextResponse.json(res);
}

