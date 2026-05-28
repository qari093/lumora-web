export type SocialMemoryObject = {
  id: string;
  kind: "squad-echo" | "shared-peak" | "first-pulse";
  participants: number;
  permanent: boolean;
};

export function createSocialMemoryObject(
  kind: SocialMemoryObject["kind"],
  participants: number
): SocialMemoryObject {
  return {
    id: `${kind}-${Date.now()}`,
    kind,
    participants: Math.max(1, participants),
    permanent: true
  };
}
