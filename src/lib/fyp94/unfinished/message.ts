import type { Fyp94CuriosityMessage, Fyp94UnfinishedThread } from "./types";

export function buildFyp94CuriosityMessage(thread: Fyp94UnfinishedThread): Fyp94CuriosityMessage {
  const subject = thread.tags[0] ?? thread.category;

  const lead =
    thread.context === "sequence"
      ? `You were close to the payoff in ${subject}`
      : thread.context === "countdown"
        ? `Something in ${subject} was about to unlock`
        : `${subject} was happening live`;

  return {
    threadId: thread.threadId,
    message: `${lead}. Continue where you left off.`,
    deeplink: `/fyp?unfinished=${encodeURIComponent(thread.threadId)}`,
  };
}
