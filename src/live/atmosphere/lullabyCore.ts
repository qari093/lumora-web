export type LullabyState = {
  enabled: boolean;
  durationSeconds: number;
  mode: "optional_global_wind_down";
};

export function createLullabyState(enabled: boolean): LullabyState {
  return {
    enabled,
    durationSeconds: 120,
    mode: "optional_global_wind_down",
  };
}
