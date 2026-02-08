import { promises as fs } from "node:fs";

export type NexaOpsSnapshot = {
  ok: boolean;
  ts: number;
  source?: string;
  error?: string;
  data?: unknown;
};

const DEFAULT_PATH = "/tmp/lumora_nexa_ops.json";

export async function readNexaOpsSnapshot(path = DEFAULT_PATH): Promise<NexaOpsSnapshot> {
  const ts = Date.now();
  try {
    const raw = await fs.readFile(path, "utf8");
    const data = JSON.parse(raw);
    return { ok: true, ts, source: path, data };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "read_failed";
    return { ok: false, ts, source: path, error: msg };
  }
}
