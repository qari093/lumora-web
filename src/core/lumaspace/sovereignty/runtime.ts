export type SovereigntyAction = "export" | "rebirth" | "time_capsule" | "digital_heirloom";

export type SovereigntyItem = {
  action: SovereigntyAction;
  title: string;
  description: string;
  userOwned: boolean;
};

export const sovereigntyItems: SovereigntyItem[] = [
  {
    action: "export",
    title: "Universe Export",
    description: "Export stories, echoes, memories, worlds, journals, profiles, and sparks.",
    userOwned: true
  },
  {
    action: "rebirth",
    title: "Rebirth",
    description: "Let the old universe rest and begin again without losing identity.",
    userOwned: true
  },
  {
    action: "time_capsule",
    title: "Time Capsule",
    description: "Seal a memory, echo, or message for your future self.",
    userOwned: true
  },
  {
    action: "digital_heirloom",
    title: "Digital Heirloom",
    description: "Preserve, pass on, or let your universe return to silence.",
    userOwned: true
  }
];

export function canUserOwnUniverse(items: SovereigntyItem[] = sovereigntyItems): boolean {
  return items.every((item) => item.userOwned === true);
}

export function getSovereigntyPromise(): string {
  return "Your universe belongs to you. You can keep it, export it, rebuild it, pass it on, or let it rest.";
}
