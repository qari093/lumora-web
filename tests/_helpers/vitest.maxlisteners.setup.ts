/**
 * Prevent noisy MaxListenersExceededWarning during large E2E suites.
 * This does not change test semantics; it only raises the listener cap.
 */
import { beforeAll } from "vitest";

beforeAll(() => {
  const p: any = process;
  if (typeof p?.setMaxListeners === "function") p.setMaxListeners(0);
});
