export type NexaInfo = {
  ok: true;
  ts: number;
  service: "nexa";
  node: { version: string; pid: number };
  app: { env: string; commit?: string; buildId?: string };
};

function envStr(v: unknown, fallback: string): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : fallback;
}

export function getNexaInfo(): NexaInfo {
  const env =
    envStr(process.env.LUMORA_ENV, "") ||
    envStr(process.env.NEXT_PUBLIC_LUMORA_ENV, "") ||
    envStr(process.env.NODE_ENV, "development");

  const commit =
    envStr(process.env.LUMORA_COMMIT_SHA, "") ||
    envStr(process.env.VERCEL_GIT_COMMIT_SHA, "") ||
    envStr(process.env.GIT_COMMIT, "");

  const buildId =
    envStr(process.env.LUMORA_BUILD_ID, "") ||
    envStr(process.env.NEXT_BUILD_ID, "") ||
    envStr(process.env.VERCEL_DEPLOYMENT_ID, "");

  return {
    ok: true,
    ts: Date.now(),
    service: "nexa",
    node: { version: process.version, pid: process.pid },
    app: {
      env,
      ...(commit ? { commit } : {}),
      ...(buildId ? { buildId } : {}),
    },
  };
}
