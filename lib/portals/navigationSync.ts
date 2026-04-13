import type { PortalKey } from "@/lib/portals/activation";

export type NavigationSyncInput = {
  currentPortal?: PortalKey | null;
  targetPortal?: PortalKey | null;
  enabledPortals?: PortalKey[] | null;
  lastVisited?: Partial<Record<PortalKey, string>> | null;
};

export type NavigationSyncResult =
  | {
      ok: true;
      state: {
        currentPortal: PortalKey;
        targetPortal: PortalKey;
        canNavigate: boolean;
        targetPath: string;
      };
    }
  | { ok: false; reason: string };

const DEFAULT_PATHS: Record<PortalKey, string> = {
  FYP: "/fyp",
  LIVE: "/live",
  GMAR: "/gmar",
  NEXA: "/nexa",
  MOVIES: "/movies",
  MUSIC: "/music",
};

export function resolveCrossPortalNavigation(
  input: NavigationSyncInput
): NavigationSyncResult {
  const currentPortal = input.currentPortal ?? null;
  const targetPortal = input.targetPortal ?? null;
  const enabled = new Set<PortalKey>(Array.isArray(input.enabledPortals) ? input.enabledPortals : []);
  const lastVisited = input.lastVisited ?? {};

  if (!currentPortal) return { ok: false, reason: "missing_current_portal" };
  if (!targetPortal) return { ok: false, reason: "missing_target_portal" };
  if (!enabled.has(currentPortal)) return { ok: false, reason: "current_portal_disabled" };
  if (!enabled.has(targetPortal)) return { ok: false, reason: "target_portal_disabled" };

  const remembered = lastVisited[targetPortal];
  const targetPath =
    typeof remembered === "string" && remembered.startsWith("/")
      ? remembered
      : DEFAULT_PATHS[targetPortal];

  return {
    ok: true,
    state: {
      currentPortal,
      targetPortal,
      canNavigate: true,
      targetPath,
    },
  };
}
