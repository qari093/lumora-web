export type LumoraRuntimeEnvironment =
  | "production"
  | "preview"
  | "development"
  | "test";

function normalizeEnvironment(value?: string): LumoraRuntimeEnvironment {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "production") return "production";
  if (normalized === "preview") return "preview";
  if (normalized === "test") return "test";

  return "development";
}

export function getLumoraRuntimeEnvironment(): LumoraRuntimeEnvironment {
  return normalizeEnvironment(
    process.env.VERCEL_ENV ??
      process.env.APP_ENV ??
      process.env.NEXT_PUBLIC_APP_ENV ??
      process.env.NODE_ENV
  );
}

export function getLumoraVersion(): string {
  return (
    process.env.NEXT_PUBLIC_APP_VERSION?.trim() ||
    process.env.APP_VERSION?.trim() ||
    process.env.npm_package_version?.trim() ||
    "v7.5"
  );
}

export function getLumoraCommitSha(): string | null {
  const sha =
    process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
    process.env.GITHUB_SHA?.trim() ||
    process.env.COMMIT_SHA?.trim();

  return sha || null;
}

export function getLumoraDeploymentId(): string | null {
  const deploymentId =
    process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
    process.env.VERCEL_URL?.trim();

  return deploymentId || null;
}

export function getLumoraRuntimeMetadata() {
  return {
    service: "lumora-web",
    version: getLumoraVersion(),
    appEnv: getLumoraRuntimeEnvironment(),
    commitSha: getLumoraCommitSha(),
    deploymentId: getLumoraDeploymentId(),
  };
}
