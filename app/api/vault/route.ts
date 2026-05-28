import { NextResponse } from "next/server";
import { createVault } from "@/lib/vault/vaultEngine";

export async function GET() {
  return NextResponse.json({
    ok: true,
    vault: createVault()
  });
}
