import { beforeAll } from "vitest";
import { ensureServerReady } from "../helpers/ensureServer";

beforeAll(async () => {
  await ensureServerReady();
});
