import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';
async function POSTImplementation() {
  return Response.json({
    ok: true,
    transferred: true,
  });
}

export async function POST(): Promise<Response> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const response = await POSTImplementation();

  for (const [name, value] of Object.entries(userPrivateNoStoreHeaders())) {
    response.headers.set(name, value);
  }

  return response;
}
