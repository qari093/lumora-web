import { NextResponse } from "next/server";

import {
  createGmarPrivateTesterProfile,
  assertGmarPrivateTesterProfile
} from "@/src/core/gmar/tester-active/privateTesterFlow";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const profile = createGmarPrivateTesterProfile({
      testerId:
        typeof body.testerId === "string"
          ? body.testerId
          : "",
      displayName:
        typeof body.displayName === "string"
          ? body.displayName
          : ""
    });

    assertGmarPrivateTesterProfile(profile);

    return NextResponse.json({
      ok: true,
      profile
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR private tester registration failed."
      },
      { status: 400 }
    );
  }
}
