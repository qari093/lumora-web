export type PortalStatus = "active" | "seed" | "shell";

export const PORTAL_STATUS: Record<string, PortalStatus> = {
  fyp: "seed",
  videos: "seed",
  gmar: "seed",
  nexa: "seed",
  movies: "seed",
  music: "seed",
  live: "shell",
  share: "active"
};

export function statusLabel(status: PortalStatus) {
  switch (status) {
    case "active": return "Active";
    case "seed": return "Seed";
    case "shell": return "Shell";
  }
}
