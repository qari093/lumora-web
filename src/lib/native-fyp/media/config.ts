export type NativeFypCdnConfig = {
  publicBaseUrl: string;
};

export function resolveNativeFypPublicUrl(
  key: string,
  config: NativeFypCdnConfig = {
    publicBaseUrl: process.env.NATIVE_FYP_CDN_BASE_URL || "/native-fyp",
  },
): string {
  const base = config.publicBaseUrl.replace(/\/$/, "");
  const cleanKey = key.replace(/^\//, "");
  return `${base}/${cleanKey}`;
}
