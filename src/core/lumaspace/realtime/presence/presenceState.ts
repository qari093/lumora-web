export function createPresenceState() {
  return {
    id: "presence_001",
    users: 4
  };
}

export {
  createRealtimePresence,
  runRealtimeRuntime
} from "@/core/lumaspace/compat/legacyContracts";
