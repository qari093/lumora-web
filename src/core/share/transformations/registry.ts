import { crossPortalAdapters } from "./adapters";
import type { CrossPortalAdapter, CrossPortalTarget } from "./types";

export function getCrossPortalAdapter(targetPortal: CrossPortalTarget): CrossPortalAdapter {
  const adapter = crossPortalAdapters.find((item) => item.targetPortal === targetPortal);
  if (!adapter) throw new Error(`cross_portal_adapter_missing:${targetPortal}`);
  return adapter;
}

export function listCrossPortalTargets(): CrossPortalTarget[] {
  return crossPortalAdapters.map((adapter) => adapter.targetPortal);
}

export function crossPortalAdapterExists(targetPortal: CrossPortalTarget): boolean {
  return crossPortalAdapters.some((adapter) => adapter.targetPortal === targetPortal);
}
