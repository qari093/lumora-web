export type NexaActivationModule = {
  id: string;
  title: string;
  mode: "guidance" | "wellbeing" | "creation" | "trust";
  status: "founder-preview" | "safe-active";
  description: string;
  href: string;
};

export const nexaActivationModules: NexaActivationModule[] = [
  {
    id: "nexa-guidance",
    title: "NEXA Guidance Core",
    mode: "guidance",
    status: "safe-active",
    description: "Founder-visible AI guidance surface for calm ecosystem navigation and next-action support.",
    href: "/nexa"
  },
  {
    id: "nexa-wellbeing",
    title: "Body Weather",
    mode: "wellbeing",
    status: "founder-preview",
    description: "A preview layer for NEXA GX wellbeing, recovery, rhythm, and low-pressure self-awareness.",
    href: "/nexa"
  },
  {
    id: "nexa-creation",
    title: "Creative Companion",
    mode: "creation",
    status: "founder-preview",
    description: "A creator support bridge for ideas, drafts, rituals, and ecosystem contribution prompts.",
    href: "/creator"
  },
  {
    id: "nexa-trust",
    title: "Trust Whisper",
    mode: "trust",
    status: "safe-active",
    description: "A trust-first explanation layer for why actions, gates, and safety limits exist.",
    href: "/lafs"
  }
];

export function getNexaActivationSummary() {
  return {
    status: "NEXA_ACTIVATED_FOR_FOUNDER_REVIEW",
    moduleCount: nexaActivationModules.length,
    aiAutonomyEnabled: false,
    medicalClaimsEnabled: false,
    testerInvitesBlocked: true,
    safeMode: true
  };
}
