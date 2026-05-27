export function buildContext(userId:string){
  return {
    userId,
    requestId: Math.random().toString(36).slice(2),
    ts: Date.now()
  };
}
