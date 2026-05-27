import type { MediaRuntime } from "../types";
import { runMediaPipeline } from "../processing/mediaPipeline";

export function runMediaRuntime(): MediaRuntime {
  return {
    active: true,
    assets: runMediaPipeline()
  };
}
