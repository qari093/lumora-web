import { compatibilityJson } from "@/src/lib/runtime-guards/compatibilityResponse";
import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const userId = auth.identity.userId;
  const response = compatibilityJson("/api/wallet/debit", "/api/zenwallet/runtime");

  for (const [name, value] of Object.entries(userPrivateNoStoreHeaders())) {
    response.headers.set(name, value);
  }

  response.headers.set("x-lumora-authenticated-user", userId);
  return response;
}
