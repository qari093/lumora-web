import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  // For now, just return a mock NFT receipt
  return NextResponse.json({
    ok: true,
    nft: {
      id: "mock-nft-" + Date.now(),
      ...body
    }
  });
}
