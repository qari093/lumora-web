import { logStage } from "./logging";
import { collectMetrics } from "./metrics";
import { tracePipeline } from "./tracing";
import { debugSnapshot } from "./debug";

export function applyObservability(items:any[], traceId:string="pipe"){
  return {
    items,
    log: logStage("pipeline", items),
    metrics: collectMetrics(items),
    trace: tracePipeline(traceId),
    debug: debugSnapshot(items)
  };
}
