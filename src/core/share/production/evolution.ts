import type { EvolutionHook } from "./types";

export function createEvolutionHooks(): EvolutionHook[] {
  return [
    { id: "future_portal_adapter_hook", target: "future_portal", enabled: true, contractVersion: "usl-extension-v1" },
    { id: "sdk_release_hook", target: "sdk", enabled: true, contractVersion: "usl-sdk-v1" },
    { id: "webhook_delivery_hook", target: "webhook", enabled: true, contractVersion: "usl-webhook-v1" },
    { id: "migration_hook", target: "migration", enabled: true, contractVersion: "usl-migration-v1" },
    { id: "extension_framework_hook", target: "extension", enabled: true, contractVersion: "usl-extension-v1" },
    { id: "monitoring_hook", target: "monitoring", enabled: true, contractVersion: "usl-monitoring-v1" },
    { id: "disaster_recovery_hook", target: "disaster_recovery", enabled: true, contractVersion: "usl-dr-v1" },
  ];
}

export function validateEvolutionHooks(hooks: EvolutionHook[]): boolean {
  return hooks.length >= 7 && hooks.every((hook) => hook.enabled && hook.contractVersion.startsWith("usl-"));
}
