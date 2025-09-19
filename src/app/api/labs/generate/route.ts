import { NextResponse } from 'next/server';
import type { GenerateRequest, GenerateResponse } from '@/types/labs';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<GenerateRequest>;
  if (!body || !body.mode || !body.effects) {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
  }
  const res: GenerateResponse = { ok: true, jobId: 'job_'+Date.now().toString(36), previewUrl: '/next.svg' };
  return NextResponse.json(res);
}

