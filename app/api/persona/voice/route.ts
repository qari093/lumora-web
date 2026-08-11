import { NextRequest, NextResponse } from 'next/server';

import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type VoiceState = {
  personaCode: string;
  isSpeaking: boolean;
  volume: number;
  emotionHint: string | null;
};

const runtimeState = new Map<string, VoiceState>();

function stateKey(userId: string, personaCode: string) {
  return `${userId}:${personaCode}`;
}

export async function POST(req: NextRequest) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json().catch(() => ({}));
    const personaCode = String(body?.personaCode || '').trim();

    if (!personaCode) {
      return NextResponse.json(
        {
          ok: false,
          error: 'personaCode_required',
        },
        {
          status: 400,
          headers: userPrivateNoStoreHeaders(),
        },
      );
    }

    const state: VoiceState = {
      personaCode,
      isSpeaking: Boolean(body?.isSpeaking),
      volume:
        typeof body?.volume === 'number' && Number.isFinite(body.volume)
          ? Math.max(0, Math.min(1, body.volume))
          : 0,
      emotionHint: typeof body?.emotionHint === 'string' ? body.emotionHint.slice(0, 100) : null,
    };

    runtimeState.set(stateKey(auth.identity.userId, personaCode), state);

    return NextResponse.json(
      {
        ok: true,
        state,
      },
      {
        headers: userPrivateNoStoreHeaders(),
      },
    );
  } catch (error: unknown) {
    console.error('[persona/voice] ingest failed', error instanceof Error ? error.message : error);

    return NextResponse.json(
      {
        ok: false,
        error: 'voice_ingest_failed',
      },
      {
        status: 500,
        headers: userPrivateNoStoreHeaders(),
      },
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const personaCode = req.nextUrl.searchParams.get('personaCode')?.trim() ?? '';

  if (!personaCode) {
    return NextResponse.json(
      {
        ok: false,
        error: 'personaCode_required',
      },
      {
        status: 400,
        headers: userPrivateNoStoreHeaders(),
      },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      state: runtimeState.get(stateKey(auth.identity.userId, personaCode)) ?? null,
    },
    {
      headers: userPrivateNoStoreHeaders(),
    },
  );
}
