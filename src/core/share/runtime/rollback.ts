import type { UniversalShareObject } from "../foundation/types";
import { transitionShare } from "./lifecycle";

export function rollbackShare(share: UniversalShareObject, reason: string): UniversalShareObject {
  const failed = share.lifecycle === "failed" ? share : { ...share, lifecycle: "failed" as const };

  return {
    ...transitionShare(failed, "rolled_back"),
    telemetry: {
      ...share.telemetry,
      failedReason: reason,
    },
  };
}
