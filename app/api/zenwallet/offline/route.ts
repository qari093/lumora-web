import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';
import { NextResponse } from 'next/server';
import { getOfflineJournal } from '@/src/core/zenwallet/offline/offlineTrust';

async function GETImplementation() {
  return NextResponse.json({ ok: true, journal: getOfflineJournal() });
}

export async function GET(): Promise<Response> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const response = await GETImplementation();

  for (const [name, value] of Object.entries(userPrivateNoStoreHeaders())) {
    response.headers.set(name, value);
  }

  return response;
}
