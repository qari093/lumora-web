export type CalmDashboardBackground = {
  theme: "calm";
  gradient: string;
  motion: "minimal";
  contrastSafe: true;
};

export function getCalmDashboardBackground(): CalmDashboardBackground {
  return {
    theme: "calm",
    gradient: "radial-gradient(circle at top, rgba(136,160,255,0.18), rgba(6,8,18,1) 58%)",
    motion: "minimal",
    contrastSafe: true,
  };
}
