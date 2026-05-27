export type KeeperOfLight = {
  id: "keeper-of-light";
  monthlyUsd: 2.99;
  grantsPower: false;
  grantsExclusiveContent: false;
  haloMote: true;
};

export function createKeeperOfLight(): KeeperOfLight {
  return {
    id: "keeper-of-light",
    monthlyUsd: 2.99,
    grantsPower: false,
    grantsExclusiveContent: false,
    haloMote: true,
  };
}
