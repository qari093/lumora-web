import Redis from "ioredis";
let client: Redis | null = null;
export function getRedis(){
  const url = process.env.REDIS_URL;
  if(!url) return null;
  if(!client){
    client = new Redis(url, { lazyConnect:true, maxRetriesPerRequest:2, enableOfflineQueue:false,
      retryStrategy:(times)=>Math.min(1000*times,3000) });
    client.on("error", ()=>{});
  }
  return client;
}
