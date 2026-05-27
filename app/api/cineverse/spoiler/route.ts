export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    ok: true,
    data: {
      mode: "smart-fold",
      defaultHidden: true,
      enabled: true
    },
    ts: Date.now()
  });
}
