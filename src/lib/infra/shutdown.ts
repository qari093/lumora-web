export function shutdown(){
  return {
    status: "shutdown",
    ts: Date.now()
  };
}
