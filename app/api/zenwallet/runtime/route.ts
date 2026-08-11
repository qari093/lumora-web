import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';
import { NextResponse } from 'next/server';
import { getZenWalletRuntimeTelemetry } from '@/src/core/zenwallet/telemetry/runtimeTelemetry';

async function GETImplementation() {
  return NextResponse.json({
    ok: true,
    telemetry: getZenWalletRuntimeTelemetry(),
  });
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
