import { PORTALS } from "./portals";

export type PortalRuntimeConfig = {
  env: "dev" | "prod";
  buildId?: string;
} & Record<string, boolean>;

export function getPortalRuntimeConfig(): PortalRuntimeConfig {
  const env =
    process.env.NODE_ENV === "production" ? "prod" : "dev";

  const cfg: PortalRuntimeConfig = {
    env,
    buildId:
      process.env.NEXT_PUBLIC_BUILD_ID ||
      process.env.VERCEL_GIT_COMMIT_SHA ||
      undefined,
  };

  for (const portal of PORTALS) {
    cfg[portal.id] = portal.enabled !== false;
  }

  return cfg;
}
