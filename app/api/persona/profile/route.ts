import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type Profile = {
  personaCode: string;
  displayName: string;
};

function fallbackProfile(personaCode: string): Profile {
  return { personaCode, displayName: "Lumora User" };
}

async function tryPrismaProfile(personaCode: string): Promise<Profile | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@/src/lib/prisma");
    const prisma = (mod?.prisma ?? mod?.default ?? null) as any;
    if (!prisma) return null;

    // These models may or may not exist depending on prisma generate + schema.
    const p = await prisma.personaProfile?.findUnique?.({ where: { personaCode } });
    if (p?.personaCode) {
      return { personaCode: p.personaCode, displayName: p.displayName ?? "Lumora User" };
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  const c = await cookies();
  const personaCode = c.get("persona_code")?.value || "avatar_001";

  const db = await tryPrismaProfile(personaCode);
  const profile = db ?? fallbackProfile(personaCode);

  return NextResponse.json({ ok: true, profile });
}
