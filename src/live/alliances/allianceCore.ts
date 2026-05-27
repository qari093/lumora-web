export type AllianceBeacon = {
  id: string;
  constellationIds: string[];
  startsAt: string;
  endsAt: string;
  active: boolean;
};

export function isAllianceActive(beacon: AllianceBeacon, now = new Date()): boolean {
  return beacon.active && now >= new Date(beacon.startsAt) && now <= new Date(beacon.endsAt);
}
