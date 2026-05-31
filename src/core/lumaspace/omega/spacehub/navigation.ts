import type { SpaceHubView } from "./types";

export type SpaceHubTab = {
  view: SpaceHubView;
  label: string;
  icon: string;
  primary: boolean;
};

export const SPACEHUB_TABS: SpaceHubTab[] = [
  { view: "orbit", label: "Orbit", icon: "home", primary: true },
  { view: "pulse", label: "Pulse", icon: "ripple", primary: true },
  { view: "vault", label: "Vault", icon: "infinity", primary: true },
  { view: "profile", label: "Profile", icon: "sphere", primary: false },
];

export function getSpaceHubTab(view: SpaceHubView): SpaceHubTab {
  const tab = SPACEHUB_TABS.find((item) => item.view === view);
  if (!tab) throw new Error("spacehub_tab_not_found");
  return tab;
}

export function nextSpaceHubView(current: SpaceHubView): SpaceHubView {
  if (current === "orbit") return "pulse";
  if (current === "pulse") return "vault";
  if (current === "vault") return "profile";
  return "orbit";
}
