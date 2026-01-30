import { describe, expect, test } from "vitest";
// __VIDEO_GEN_TEST_BOOTSTRAP_START__
import { execSync } from "node:child_process";
import path from "node:path";
import fsNode from "node:fs";

const __testDbPath = path.resolve(process.cwd(), "prisma", "dev.vitest.video_gen.db");
const __testDbUrl = "file:" + __testDbPath;

// Ensure file exists (SQLite will create on connect, but we want stable path)
try { fsNode.mkdirSync(path.dirname(__testDbPath), { recursive: true }); } catch {}
try { fsNode.closeSync(fsNode.openSync(__testDbPath, "a")); } catch {}

process.env.DATABASE_URL = __testDbUrl;

// Apply migrations to this sqlite DB so VideoGenJob table exists.
function __applyMigrationsOnce() {
  const key = "__LUMORA_VIDEO_GEN_MIGRATIONS_APPLIED__";
  // @ts-ignore
  if (globalThis[key]) return;
  try {
    execSync("npx -y prisma migrate deploy", {
      stdio: "pipe",
      env: { ...process.env, DATABASE_URL: __testDbUrl },
    });
  } catch (e) {
    // Surface deploy failure with context
    const msg = (e && e.message) ? e.message : String(e);
    throw new Error("prisma migrate deploy failed: " + msg);
  }
  // @ts-ignore
  globalThis[key] = true;
}
__applyMigrationsOnce();
// __VIDEO_GEN_TEST_BOOTSTRAP_END__

beforeAll(async () => {
  const submitMod = await import("../../app/api/video-gen/route");
  const statusMod = await import("../../app/api/video-gen/status/route");
  submitPOST = submitMod.POST;
  statusGET = statusMod.GET;
});



function mkReq(url: string, method: "GET" | "POST", body?: any): Request {
  const headers: Record<string, string> = {};
  let init: RequestInit = { method, headers };

  if (method === "POST") {
    headers["content-type"] = "application/json";
    init = { ...init, body: JSON.stringify(body ?? {}) };
  }
  return new Request(url, init);
}

async function readJson(res: Response): Promise<any> {
  const t = await res.text();
  try {
    return JSON.parse(t);
  } catch {
    return { __raw: t };
  }
}

function setAbsSqliteDbUrl() {
  const absDbPath = `${process.cwd()}/prisma/dev.db`;
  process.env.DATABASE_URL = `file:${absDbPath}`;
}

let submitPOST: any;
let statusGET: any;

describe("video-gen DB-backed submit+status (handler-level)", () => {
  test("submit returns {ok, jobId} and status returns done", async () => {
    setAbsSqliteDbUrl();

    const { POST: submitPOST } = await import("../../app/api/video-gen/route");
    const { GET: statusGET } = await import("../../app/api/video-gen/status/route");

    const req = mkReq("http://localhost/api/video-gen", "POST", { prompt: "make a calm neon loop" });
    const res = await submitPOST(req);
    const j = await readJson(res);

    if (res.status !== 200) {
      // Surface real error payload for debugging
      throw new Error(`submit status=${res.status} payload=${JSON.stringify(j)}`);
    }

    expect(j.ok).toBe(true);
    expect(typeof j.jobId).toBe("string");
    expect(j.jobId.length).toBeGreaterThan(6);

    const sreq = mkReq(`http://localhost/api/video-gen/status?jobId=${encodeURIComponent(j.jobId)}`, "GET");
    const sres = await statusGET(sreq);
    const sj = await readJson(sres);

    if (sres.status !== 200) {
      throw new Error(`status status=${sres.status} payload=${JSON.stringify(sj)}`);
    }

    expect(sj.ok).toBe(true);
    expect(sj.job?.jobId).toBe(j.jobId);
    expect(sj.job?.status).toBe("done");
    expect(typeof sj.job?.resultUrl).toBe("string");
  });

  test("rejects invalid prompt", async () => {
    setAbsSqliteDbUrl();
    const { POST: submitPOST } = await import("../../app/api/video-gen/route");

    const req = mkReq("http://localhost/api/video-gen", "POST", { prompt: "" });
    const res = await submitPOST(req);
    expect(res.status).toBe(400);
    const j = await readJson(res);
    expect(j.ok).toBe(false);
  });

  test("status requires jobId", async () => {
    setAbsSqliteDbUrl();
    const { GET: statusGET } = await import("../../app/api/video-gen/status/route");

    const req = mkReq("http://localhost/api/video-gen/status", "GET");
    const res = await statusGET(req);
    expect(res.status).toBe(400);
    const j = await readJson(res);
    expect(j.ok).toBe(false);
  });

  test("status 404 for unknown job", async () => {
    setAbsSqliteDbUrl();
    const { GET: statusGET } = await import("../../app/api/video-gen/status/route");

    const req = mkReq("http://localhost/api/video-gen/status?jobId=vg_unknown_123", "GET");
    const res = await statusGET(req);
    expect(res.status).toBe(404);
    const j = await readJson(res);
    expect(j.ok).toBe(false);
  });
});
