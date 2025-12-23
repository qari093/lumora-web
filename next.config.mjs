/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

/** Step 96: legacy /api/_health compatibility via rewrites (SAFE, non-recursive) */
const __step96_original_rewrites__ = nextConfig?.rewrites;

async function __step96_merge_rewrites__() {
  const legacy = [{ source: "/api/_health", destination: "/api/health-alias" }];

  let out;
  try {
    out = typeof __step96_original_rewrites__ === "function"
      ? await __step96_original_rewrites__()
      : __step96_original_rewrites__;
  } catch {
    out = undefined;
  }

  if (!out) return legacy;
  if (Array.isArray(out)) return [...legacy, ...out];

  if (out && typeof out === "object") {
    const merged = { ...out };
    const bf = Array.isArray((out).beforeFiles) ? (out).beforeFiles : [];
    (merged).beforeFiles = [...legacy, ...bf];
    return merged;
  }

  return legacy;
}

nextConfig.rewrites = __step96_merge_rewrites__;

export default nextConfig;
