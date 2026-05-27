export type EchoGift = {
  id: string;
  title: string;
  publicViewer: true;
  loginRequired: false;
  callToAction: "come_see_your_own_memory";
};

export function createWelcomeEchoGift(playerName: string): EchoGift {
  const safeName = playerName.trim() || "Traveler";

  return {
    id: `welcome-echo-${safeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: `Welcome to the Civilization, ${safeName}`,
    publicViewer: true,
    loginRequired: false,
    callToAction: "come_see_your_own_memory",
  };
}
