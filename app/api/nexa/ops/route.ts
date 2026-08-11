export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { readNexaOpsSnapshot } from '@/lib/nexa/ops_snapshot';
import { addSoftRateLimitHeaders } from '@/lib/nexa/rl';

function pickSnapshotPaths(port: string): string[] {
  const clean = (port || '').replace(/[^0-9]/g, '') || '3040';
  return [`/tmp/lumora_nexa_ops_${clean}.json`, `/tmp/lumora_nexa_ops.json`];
}

async function bestEffortRead(port: string) {
  const paths = pickSnapshotPaths(port);
  for (const path of paths) {
    const out = await readNexaOpsSnapshot(path);
    if (out?.ok) return { ...out, source: path };
  }
  const last = await readNexaOpsSnapshot(paths[0]);
  return {
    ok: false,
    ts: Date.now(),
    source: paths[0],
    error: last?.error || 'snapshot_unavailable',
  };
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const port = url.searchParams.get('port') || process.env.PORT || '3040';
    const data = await bestEffortRead(String(port));

    const res = NextResponse.json(
      { ok: true, ts: Date.now(), source: { port: String(port) }, data },
      { status: 200 },
    );

    try {
      addSoftRateLimitHeaders(res);
    } catch {}
    res.headers.set('x-nexa-ops', '1');
    res.headers.set('cache-control', 'no-store, max-age=0');
    return res;
  } catch (e: any) {
    const msg = typeof e?.message === 'string' ? e.message : 'internal_error';
    const res = NextResponse.json({ ok: false, ts: Date.now(), error: msg }, { status: 200 });
    try {
      addSoftRateLimitHeaders(res);
    } catch {}
    res.headers.set('x-nexa-ops', '1');
    res.headers.set('cache-control', 'no-store, max-age=0');
    return res;
  }
}
