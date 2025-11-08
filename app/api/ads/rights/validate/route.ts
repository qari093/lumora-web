import { NextResponse } from "next/server";

type Payload = {
  region?: string;
  approximateAge?: number;
  localConsent?: boolean;
  meta?: {
    adId?: string;
    brand?: string;
    category?: string;
    targetRadiusKm?: number;
  };
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const region = String(body.region || "US").toUpperCase();
    const age = Number.isFinite(body.approximateAge) ? Number(body.approximateAge) : 0;
    const consent = !!body.localConsent;
    const category = String(body.meta?.category || "generic").toLowerCase();

    const minAge = region === "US" ? 21 : region === "EU" ? 18 : 21;
    const policyByCategory: Record<string, { minAge: number; consentRequired: boolean }> = {
      alcohol: { minAge, consentRequired: true },
      generic: { minAge: 0, consentRequired: false }
    };
    const rules = policyByCategory[category] || policyByCategory.generic;

    if (rules.consentRequired && !consent) {
      return NextResponse.json(
        { ok: false, error: "consent_required", details: { category, region } },
        { status: 400 }
      );
    }

    if (age < rules.minAge) {
      return NextResponse.json(
        { ok: false, error: "age_restricted", details: { category, region, minAge: rules.minAge, providedAge: age } },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      verdict: "allowed",
      details: {
        category,
        region,
        minAge: rules.minAge,
        consentRequired: rules.consentRequired,
        adId: body.meta?.adId ?? null,
        brand: body.meta?.brand ?? null,
        targetRadiusKm: body.meta?.targetRadiusKm ?? null
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
