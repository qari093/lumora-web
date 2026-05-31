import type { ConstellationBridge, ThreadSpace } from "./types";

export function createThreadSpace(bridge: ConstellationBridge): ThreadSpace {
  return {
    id: bridge.threadSpaceId,
    bridgeId: bridge.id,
    participantIds: [bridge.citizenA, bridge.citizenB],
    exchangeLimit: 1,
    echoes: [],
  };
}

export function addThreadEcho(
  space: ThreadSpace,
  echo: ThreadSpace["echoes"][number],
): ThreadSpace {
  if (!space.participantIds.includes(echo.authorId)) throw new Error("author_not_in_thread");
  const authorEchoes = space.echoes.filter((item) => item.authorId === echo.authorId);
  if (authorEchoes.length >= space.exchangeLimit) throw new Error("exchange_limit_reached");

  return {
    ...space,
    echoes: [...space.echoes, echo],
  };
}
