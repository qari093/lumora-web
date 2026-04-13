export type TrailerCountdown = {
  eventId: string;
  remainingSec: number;
  priority: "high";
};

export function buildTrailerCountdown(): TrailerCountdown {
  return {
    eventId: "trailer_event_001",
    remainingSec: 120,
    priority: "high",
  };
}
