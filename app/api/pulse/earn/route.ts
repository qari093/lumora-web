import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function disabled() {
  return NextResponse.json(
    {
      ok: false,
      error: "legacy_pulse_earn_disabled",
      quarantined: true,
    },
    {
      status: 410,
      headers: {
        "cache-control": "private, no-store, max-age=0",
        "x-lumora-launch-quarantine": "true",
      },
    },
  );
}

export async function GET() {
  return disabled();
}

export async function POST() {
  return disabled();
}

export async function PUT() {
  return disabled();
}

export async function PATCH() {
  return disabled();
}

export async function DELETE() {
  return disabled();
}
