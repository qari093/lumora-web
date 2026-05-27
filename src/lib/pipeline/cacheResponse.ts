import { getPipelineCache } from "./cacheHook";
import { isPipelineExpired } from "./ttlHook";

export function getCachedResponse(key:string){
  const cached = getPipelineCache(key);
  if(!cached) return null;
  if(isPipelineExpired(key)) return null;
  return cached;
}
