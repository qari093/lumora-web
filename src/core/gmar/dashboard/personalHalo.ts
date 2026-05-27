export type PersonalHaloLaunchState = {
  firstLightVisible: true;
  dailySparkVisible: true;
  solaceCoinSlot: true;
  keeperMoteSlot: true;
};

export function createPersonalHaloLaunchState(): PersonalHaloLaunchState {
  return {
    firstLightVisible: true,
    dailySparkVisible: true,
    solaceCoinSlot: true,
    keeperMoteSlot: true,
  };
}
