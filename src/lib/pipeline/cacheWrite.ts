import { setPipelineCache } from "./cacheHook";
import { setPipelineTTL } from "./ttlHook";

export function writeCachedResponse(key:string, value:any, ttlMs:number=30000){
  setPipelineCache(key, value);
  setPipelineTTL(key, ttlMs);
  return value;
}
