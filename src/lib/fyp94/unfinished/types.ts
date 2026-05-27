export type Fyp94UnfinishedContext = "sequence" | "countdown" | "wave";

export type Fyp94UnfinishedThread = {
  threadId: string;
  anonymousUserId: string;
  context: Fyp94UnfinishedContext;
  clipId?: string;
  sequenceId?: string;
  waveId?: string;
  category: string;
  tags: string[];
  createdAt: string;
  resumesUntil: string;
};

export type Fyp94CuriosityMessage = {
  threadId: string;
  message: string;
  deeplink: string;
};
