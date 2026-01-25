import { beforeAll, afterAll } from "vitest";
import { ensureServer, shutdownServer } from "./ensureServer";

const shouldBoot = process.env.LUMORA_BOOT_NEXT === "1";

if (shouldBoot) {
  beforeAll(async () => {
    await ensureServer({ timeoutMs: 120000, quiet: true, outDir: process.env.LUMORA_NEXT_LOG_DIR });
  });

  afterAll(async () => {
    await shutdownServer();
  });
}
