export type LiveActivationRoom = {
  id: string;
  title: string;
  mode: "pulse" | "room" | "signal" | "review";
  status: "active" | "safe-preview";
  participants: number;
  description: string;
  href: string;
};

export const liveActivationRooms: LiveActivationRoom[] = [
  {
    id: "live-pulse-room",
    title: "Live Pulse Room",
    mode: "pulse",
    status: "active",
    participants: 12,
    description: "A founder-review room showing live ecosystem movement without opening public participation.",
    href: "/api/live/rooms"
  },
  {
    id: "creator-signal-room",
    title: "Creator Signal Room",
    mode: "signal",
    status: "safe-preview",
    participants: 7,
    description: "A calm room for creator activity, reactions, and first-wave observation readiness.",
    href: "/api/live/runtime"
  },
  {
    id: "gmar-watch-room",
    title: "GMAR Watch Room",
    mode: "room",
    status: "safe-preview",
    participants: 5,
    description: "A live bridge into GMAR play activity and mission-room validation.",
    href: "/gmar"
  },
  {
    id: "trust-review-room",
    title: "Trust Review Room",
    mode: "review",
    status: "active",
    participants: 3,
    description: "A founder-only operational room for moderation, trust, and safety visibility.",
    href: "/api/live/health"
  }
];

export function getLiveActivationSummary() {
  return {
    status: "LIVE_ACTIVATED_FOR_FOUNDER_REVIEW",
    roomCount: liveActivationRooms.length,
    visibleParticipants: liveActivationRooms.reduce((sum, room) => sum + room.participants, 0),
    publicBroadcastEnabled: false,
    testerInvitesBlocked: true,
    safeMode: true
  };
}
