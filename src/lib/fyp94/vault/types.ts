export type Fyp94VaultClip = {
  id: string;
  title: string;
  thrillScore: number;
  category: string;
};

export type Fyp94PulseVault = {
  vaultId: string;
  anonymousUserId: string;
  clipIds: string[];
  unlocksAtScore: number;
  unlockedAt?: string;
  relocksAt?: string;
  state: "locked" | "unlocked" | "relocked";
};
