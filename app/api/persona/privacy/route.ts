import { sanitizePersonaPrivacy } from "@/lib/persona/privacy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();

  // Pass through only; let sanitizer handle validation
  const privacy = sanitizePersonaPrivacy(body as any);

  return Response.json({ ok: true, privacy });
}