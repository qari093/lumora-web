export function hapticPolicyHealthy() {
  return {
    intensityCapped: true,
    disabledInLowPower: true,
    userControllable: true,
  };
}
