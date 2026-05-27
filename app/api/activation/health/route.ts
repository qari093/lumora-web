export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    data: {
      system: "alive",
      mode: "activation-phase",
      uptime: process.uptime()
    },
    ts: Date.now()
  });
}
