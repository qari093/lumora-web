import { beforeAll, afterAll } from "vitest";
import { ensureServer, shutdownServer } from "./ensureServer";

const shouldBoot = process.env.LUMORA_BOOT_NEXT === "1";

if (shouldBoot) {
  beforeAll(async () => {
    await ensureServer({ timeoutMs: 120000 });
  });

  afterAll(async () => {
    await shutdownServer();
  });
}
