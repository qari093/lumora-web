import { NextResponse } from "next/server";

export async function GET() {
  const policy = {
    version: "1.0",
    categories: {
      alcohol: { minAge: { US: 21, EU: 18 }, consentRequired: true },
      generic: { minAge: { default: 0 }, consentRequired: false }
    },
    geoTargeting: { defaultMaxRadiusKm: 50, maxRadiusKm: 200 }
  };
  return NextResponse.json({ ok: true, policy });
}
