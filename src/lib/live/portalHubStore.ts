type Persona = { avatarId: string | null; emojiId: string | null };

export type PortalHub = {
  id: string;
  title: string;
  roomId: string;
  createdAt: string;
  clipCount: number;
  chatActive: boolean;

  lastPersona: Persona;
  lastEventType: string | null;
  lastActivityAt: string | null;
};

const hubs = new Map<string, PortalHub>();

function nowIso() {
  return new Date().toISOString();
}

export function seedDemoHub() {
  if (hubs.has("hub_demo_001")) return;
  hubs.set("hub_demo_001", {
    id: "hub_demo_001",
    title: "Demo Portal Hub",
    roomId: "demo-room",
    createdAt: nowIso(),
    clipCount: 3,
    chatActive: true,
    lastPersona: { avatarId: null, emojiId: null },
    lastEventType: null,
    lastActivityAt: null,
  });
}

export function listHubs(): PortalHub[] {
  seedDemoHub();
  return Array.from(hubs.values()).sort((a, b) => (b.lastActivityAt || b.createdAt).localeCompare(a.lastActivityAt || a.createdAt));
}

export function touchHubFromRoomState(roomId: string, persona: Persona) {
  seedDemoHub();
  for (const h of hubs.values()) {
    if (h.roomId !== roomId) continue;
    h.lastPersona = { avatarId: persona.avatarId ?? null, emojiId: persona.emojiId ?? null };
    h.lastActivityAt = nowIso();
  }
}

export function touchHubFromEvent(roomId: string, eventType: string) {
  seedDemoHub();
  for (const h of hubs.values()) {
    if (h.roomId !== roomId) continue;
    h.lastEventType = eventType || null;
    h.lastActivityAt = nowIso();
  }
}


export function listPortalHubs() {
  // Always return a fresh copy (avoid accidental mutation by callers)
  return Array.from(portalHubs.values()).map((h) => ({ ...h }));
}
