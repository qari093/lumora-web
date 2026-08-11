import { NextResponse } from 'next/server';

type SafetyValidationBody = {
  userId?: string;
  contentId?: string;
  text?: string;
  mediaType?: string;
  portal?: string;
};

function validateSafetyPayload(body: SafetyValidationBody) {
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const mediaType = typeof body.mediaType === 'string' ? body.mediaType : 'unknown';
  const portal = typeof body.portal === 'string' ? body.portal : 'unknown';

  const hardBlockedTerms = ['self-harm-instruction', 'exploit-child', 'terror-instruction'];
  const lower = text.toLowerCase();
  const blocked = hardBlockedTerms.some((term) => lower.includes(term));

  return {
    ok: !blocked,
    allowed: !blocked,
    risk: blocked ? 'blocked' : 'low',
    action: blocked ? 'reject' : 'allow',
    checks: {
      textPresent: text.length > 0,
      mediaType,
      portal,
      abuseKeywordScan: blocked ? 'blocked' : 'clear',
      betaSafeMode: true,
    },
  };
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'lumora-safety-validation',
      status: 'ready',
      allowed: true,
      mode: 'preview_safe',
      checks: {
        abuseKeywordScan: 'available',
        betaSafeMode: true,
        runtime: 'healthy',
      },
      warnings: [
        'Preview safety validation is contract-safe and must be connected to production moderation providers before public beta.',
      ],
      ts: Date.now(),
    },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as SafetyValidationBody;
  const result = validateSafetyPayload(body);

  return NextResponse.json(
    {
      service: 'lumora-safety-validation',
      status: 'validated',
      ...result,
      ts: Date.now(),
    },
    { status: 200 },
  );
}
