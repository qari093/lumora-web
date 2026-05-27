import type { Fyp94UnfinishedThread } from "./types";

export function canResumeFyp94UnfinishedThread(thread: Fyp94UnfinishedThread, now = new Date()): boolean {
  return new Date(thread.resumesUntil).getTime() > now.getTime();
}

export function buildFyp94ResumeState(thread: Fyp94UnfinishedThread): {
  threadId: string;
  target: "clip" | "sequence" | "wave";
  targetId: string | undefined;
} {
  if (thread.context === "sequence") {
    return { threadId: thread.threadId, target: "sequence", targetId: thread.sequenceId };
  }

  if (thread.context === "wave") {
    return { threadId: thread.threadId, target: "wave", targetId: thread.waveId };
  }

  return { threadId: thread.threadId, target: "clip", targetId: thread.clipId };
}
