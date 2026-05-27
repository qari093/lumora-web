export const domainOwners = {
  fyp: "discovery",
  live: "realtime",
  gmar: "games",
  nexa: "wellbeing",
  cineverse: "cinema",
  zendoro: "commerce",
  zencoin: "economy"
} as const;

export function resolveDomainOwner(domain: keyof typeof domainOwners) {
  return domainOwners[domain];
}
