import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const launchMode = (process.env.LAUNCH_MODE || process.env.LUMORA_LAUNCH_MODE || "").toLowerCase();
  const publicAccess = (process.env.PUBLIC_ACCESS || process.env.LUMORA_PUBLIC_ACCESS || "").trim();
  const isPrivate = launchMode === "private" || publicAccess === "0";

  if (isPrivate) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
  };
}
