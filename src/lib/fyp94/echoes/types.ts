export type Fyp94WaveEcho = {
  echoId: string;
  waveId: string;
  anonymousUserId: string;
  posterIds: string[];
  createdAt: string;
  expiresAt: string;
  state: "active" | "expired";
};

export type Fyp94EchoSlot = {
  waveId: string;
  status: "collected" | "missed";
};
