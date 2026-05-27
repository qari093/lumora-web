import type { InfrastructureCapability } from "./types";

export const FINAL_LAUNCH_REQUIRED_LOCKS = [
  ".lumora_launch_readiness_phase01_lock",
  ".lumora_launch_readiness_phase02_lock",
  ".lumora_launch_readiness_phase03_lock",
  ".lumora_launch_readiness_phase04_lock",
  ".lumora_launch_readiness_phase05_lock",
  ".lumora_launch_readiness_phase06_lock",
  ".lumora_launch_readiness_phase07_lock"
];

export const FINAL_INFRASTRUCTURE_CAPABILITIES: InfrastructureCapability[] = [
  {
    name: "edge_cache_behavior",
    required: true,
    ready: true,
    severity: "high",
    message: "Edge cache behavior must be stable."
  },
  {
    name: "queue_stability",
    required: true,
    ready: true,
    severity: "high",
    message: "Queue stability must be validated."
  },
  {
    name: "retry_systems",
    required: true,
    ready: true,
    severity: "high",
    message: "Retry systems must be active."
  },
  {
    name: "failover_systems",
    required: true,
    ready: true,
    severity: "critical",
    message: "Failover systems must be available."
  },
  {
    name: "telemetry_aggregation",
    required: true,
    ready: true,
    severity: "high",
    message: "Telemetry aggregation must work."
  },
  {
    name: "build_stability",
    required: true,
    ready: true,
    severity: "critical",
    message: "Build must be stable."
  },
  {
    name: "chaos_recovery",
    required: true,
    ready: false,
    severity: "medium",
    message: "Chaos recovery needs real-user/private-beta pressure validation."
  },
  {
    name: "production_load_behavior",
    required: true,
    ready: false,
    severity: "medium",
    message: "Production load behavior needs private-beta pressure validation."
  },
  {
    name: "rollout_safety",
    required: true,
    ready: true,
    severity: "critical",
    message: "Rollout safety must be available."
  },
  {
    name: "rollback_safety",
    required: true,
    ready: true,
    severity: "critical",
    message: "Rollback safety must be available."
  }
];
