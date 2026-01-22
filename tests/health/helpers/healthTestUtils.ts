import { beforeAll } from "vitest";
import { ensureServerReady } from "../../helpers/ensureServer";

export const BASE =
  process.env.BASE_URL || "http://127.0.0.1:3000";

export function withHealthServer() {
  beforeAll(async () => {
    await ensureServerReady(BASE);
  });
}
