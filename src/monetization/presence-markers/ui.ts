import { PresenceMarkerIdentity } from "./identity";

export function buildPresenceMarkerUi(identity: PresenceMarkerIdentity) {
  return {
    visible: true,
    transparent: true,
    label: identity.disclosure,
    sponsorName: identity.sponsorName,
    markerType: identity.markerType,
    hiddenSubliminal: false,
  };
}
