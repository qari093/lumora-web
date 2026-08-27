import {
  createSocketShard,
  validateSocketRuntime
} from "./socketRuntime";

export function createSocketRuntime() {
  const shard = createSocketShard("primary");
  const validation = validateSocketRuntime();

  return {
    healthy:
      shard.healthy &&
      validation.orchestrated &&
      validation.reconnectSafe &&
      validation.heartbeat &&
      validation.distributed,
    shard,
    ...validation
  };
}
