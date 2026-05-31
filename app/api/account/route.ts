import { NextResponse } from "next/server";

function json(status: number, data: unknown) {
  return NextResponse.json(data, { status });
}

export async function GET() {
  return json(200, {
    ok: true,
    account: {
      userId: "demo-user",
      identity: "lumora-account-contract",
      profileLinked: true,
      walletLinked: true,
      zencoinLinked: true,
      lumaspaceLinked: true,
    },
    mode: "contract_ready",
  });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));

  return json(200, {
    ok: true,
    updated: true,
    account: {
      userId: String(body?.userId || "demo-user"),
      profileLinked: true,
      identity: "lumora-account-contract",
    },
    mode: "contract_ready",
  });
}
