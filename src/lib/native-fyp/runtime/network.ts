export type NetworkMode = "wifi" | "cellular" | "data_saver";

export function detectNetworkMode(opts: {
  isWifi?: boolean;
  dataSaver?: boolean;
}): NetworkMode {
  if (opts.dataSaver) return "data_saver";
  if (opts.isWifi) return "wifi";
  return "cellular";
}
