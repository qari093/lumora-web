export type SocketRuntimeState = {
  healthy: boolean;
  shard: string;
  latencyMs: number;
};

export function createSocketRuntime(): SocketRuntimeState {
  return {
    healthy: true,
    shard: "live-core",
    latencyMs: 24
  };
}
