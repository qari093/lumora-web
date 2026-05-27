export type AfterglowArtifactType = "pulse_reel" | "echo_mosaic" | "event_shard";

export type AfterglowArtifact = {
  id: string;
  eventId: string;
  type: AfterglowArtifactType;
  createdAt: string;
};

export function createAfterglowArtifacts(eventId: string): AfterglowArtifact[] {
  const createdAt = new Date().toISOString();
  return [
    { id: `${eventId}:pulse_reel`, eventId, type: "pulse_reel", createdAt },
    { id: `${eventId}:echo_mosaic`, eventId, type: "echo_mosaic", createdAt },
    { id: `${eventId}:event_shard`, eventId, type: "event_shard", createdAt },
  ];
}
