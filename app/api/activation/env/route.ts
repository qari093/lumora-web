export const dynamic = "force-dynamic";

export async function GET() {
  const required = [
    "DATABASE_URL",
    "REDIS_URL",
    "NEXT_PUBLIC_APP_URL"
  ];

  const status = required.map((key) => ({
    key,
    present: !!process.env[key]
  }));

  return Response.json({
    ok: true,
    data: {
      envValidation: true,
      variables: status
    },
    ts: Date.now()
  });
}
