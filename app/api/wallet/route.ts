import { compatibilityJson } from '@/src/lib/runtime-guards/compatibilityResponse';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const response = compatibilityJson('/api/wallet', '/api/zenwallet/runtime');

  Object.entries(userPrivateNoStoreHeaders()).forEach(([name, value]) => {
    response.headers.set(name, value);
  });

  return response;
}
