import { compatibilityJson } from '@/src/lib/runtime-guards/compatibilityResponse';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const dynamic = 'force-dynamic';

async function compatibilityResponse() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const response = compatibilityJson('/api/wallets', '/api/zenwallet/runtime');

  Object.entries(userPrivateNoStoreHeaders()).forEach(([name, value]) => {
    response.headers.set(name, value);
  });

  return response;
}

export async function GET() {
  return compatibilityResponse();
}

export async function POST() {
  return compatibilityResponse();
}
