declare global {
  // eslint-disable-next-line no-var
  var __CMP_ASSIGN: Map<string, Set<string>> | undefined; // campaignId -> Set<creativeId>
  // eslint-disable-next-line no-var
  var __CMP_REV: Map<string, Set<string>> | undefined;    // creativeId -> Set<campaignId>
}
const FWD: Map<string, Set<string>> = (globalThis.__CMP_ASSIGN ||= new Map());
const REV: Map<string, Set<string>>  = (globalThis.__CMP_REV   ||= new Map());

export function assignCreative(campaignId: string, creativeId: string) {
  if (!campaignId || !creativeId) throw new Error("BAD_REQUEST");
  (FWD.get(campaignId) || (FWD.set(campaignId,new Set()), FWD.get(campaignId)!)).add(creativeId);
  (REV.get(creativeId) || (REV.set(creativeId,new Set()), REV.get(creativeId)!)).add(campaignId);
  return { campaignId, creativeId };
}
export function unassignCreative(campaignId: string, creativeId: string) {
  FWD.get(campaignId)?.delete(creativeId);
  REV.get(creativeId)?.delete(campaignId);
  return { campaignId, creativeId };
}
export function creativesForCampaign(campaignId: string): string[] {
  return Array.from(FWD.get(campaignId) || []);
}
export function campaignsForCreative(creativeId: string): string[] {
  return Array.from(REV.get(creativeId) || []);
}
