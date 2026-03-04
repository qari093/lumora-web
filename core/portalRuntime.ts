export type PortalRuntimeConfig = {
  // Future: feature flags, env capability switches, rollout controls.
  env: "dev" | "prod";
  buildId?: string;
};

export function getPortalRuntimeConfig(): PortalRuntimeConfig {
  const env = (process.env.NODE_ENV === "production" ? "prod" : "dev") as PortalRuntimeConfig["env"];
  return {
    env,
    buildId: process.env.NEXT_PUBLIC_BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || undefined,
  };
}
