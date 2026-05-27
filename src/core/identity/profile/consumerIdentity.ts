export type ConsumerIdentity = {
  id: string;
  displayName: string;
  guest: boolean;
};

export function createConsumerIdentity(id = "guest") {
  return {
    id,
    displayName: id === "guest" ? "Guest" : "Lumora User",
    guest: id === "guest"
  };
}
