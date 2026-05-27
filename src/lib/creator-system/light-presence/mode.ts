export type LightPresenceMode = {
  creatorId: string;
  enabled: boolean;
  mode: "light-presence";
};

export function enableLightPresence(creatorId: string): LightPresenceMode {
  return {
    creatorId,
    enabled: true,
    mode: "light-presence",
  };
}

export function disableLightPresence(creatorId: string): LightPresenceMode {
  return {
    creatorId,
    enabled: false,
    mode: "light-presence",
  };
}
