import { NextResponse } from "next/server";
import { withSafeLive } from "@/lib/live/withSafeLive";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return withSafeLive(async () => {
    const roomId = params?.id || "unknown";

    return NextResponse.json(
      {
        ok: true,
        room: {
          id: roomId,
        },
      },
      {
        status: 200,
        headers: {
          "x-ratelimit-limit": "1000",
          "x-ratelimit-remaining": "999",
        },
      }
    );
  });
}
