import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Profile = {
  personaCode: string;
  displayName: string;
};

function fallbackProfile(personaCode: string, email: string): Profile {
  const localPart = email.split('@')[0]?.trim();

  return {
    personaCode,
    displayName: localPart || 'Lumora User',
  };
}

async function tryPrismaProfile(personaCode: string): Promise<Profile | null> {
  try {
    const mod = require('@/src/lib/prisma');
    const prisma = (mod?.prisma ?? mod?.default ?? null) as any;

    if (!prisma) {
      return null;
    }

    const profile = await prisma.personaProfile?.findUnique?.({
      where: {
        personaCode,
      },
    });

    if (!profile?.personaCode) {
      return null;
    }

    return {
      personaCode: profile.personaCode,
      displayName: profile.displayName ?? 'Lumora User',
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const cookieStore = await cookies();
  const personaCode = cookieStore.get('persona_code')?.value || 'avatar_001';

  const databaseProfile = await tryPrismaProfile(personaCode);

  const profile = databaseProfile ?? fallbackProfile(personaCode, auth.identity.email);

  return NextResponse.json(
    {
      ok: true,
      userId: auth.identity.userId,
      profile,
    },
    {
      headers: userPrivateNoStoreHeaders(),
    },
  );
}
