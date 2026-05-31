export type LumoraPortal = "fyp" | "live" | "gmar" | "cineverse" | "echo" | "nexa" | "zendoro";

export type EcosystemEvent = {
  id: string;
  portal: LumoraPortal;
  citizenId: string;
  sourceId: string;
  eventType: string;
  memoryEligible: boolean;
  signalEligible: boolean;
};

export type EcosystemMemory = {
  id: string;
  eventId: string;
  destination: "space_vault" | "community_tree" | "shared_world";
};

export type EcosystemSignal = {
  id: string;
  eventId: string;
  pulseEligible: boolean;
  contributionEligible: boolean;
};
