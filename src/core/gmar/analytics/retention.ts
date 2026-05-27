export function retentionRate(active: number, installs: number) {
  return installs === 0 ? 0 : active / installs;
}
