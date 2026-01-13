export const runtime = "nodejs";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function GET() {
  try {
    const sha =
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.GIT_COMMIT_SHA ||
      process.env.COMMIT_SHA ||
      "";
    const env = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
    const buildTs = process.env.BUILD_TIMESTAMP || "";
    const ver =
      process.env.APP_VERSION ||
      process.env.npm_package_version ||
      "";

    return json({
      ok: true,
      service: "lumora-web",
      env,
      version: ver || "0.0.0",
      commit: sha || "unknown",
      buildTs: buildTs || "unknown",
      ts: Date.now(),
    });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
