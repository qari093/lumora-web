import { beforeAll } from "vitest";

// React expects this flag in some test environments to avoid "not configured to support act(...)" warnings.
beforeAll(() => {
  // @ts-expect-error
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});
