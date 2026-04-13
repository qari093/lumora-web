export type ExclusivityLayer = {
  mode: "stolen_glance";
  expiresInSec: number;
  maxViews: number;
};

export function buildExclusivityLayer(): ExclusivityLayer {
  return {
    mode: "stolen_glance",
    expiresInSec: 900,
    maxViews: 1,
  };
}
