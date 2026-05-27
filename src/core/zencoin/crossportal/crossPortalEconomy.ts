export const crossPortalEconomy = {
  echoIntegrated: true,
  gmarIntegrated: true,
  cineverseIntegrated: true,
  lumaspaceIntegrated: true,
  liveIntegrated: true,
  nexaIntegrated: true,
  sharedBalanceRuntime: true
};

export function crossPortalHealthy(): boolean {
  return Object.values(crossPortalEconomy).every(Boolean);
}
