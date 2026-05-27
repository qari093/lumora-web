export type SocialOrbitLaunchState = {
  echoGiftVisible: true;
  onlineLightsVisible: true;
  squadPlaceholderVisible: true;
  liveRoomsEnabled: false;
};

export function createSocialOrbitLaunchState(): SocialOrbitLaunchState {
  return {
    echoGiftVisible: true,
    onlineLightsVisible: true,
    squadPlaceholderVisible: true,
    liveRoomsEnabled: false,
  };
}
