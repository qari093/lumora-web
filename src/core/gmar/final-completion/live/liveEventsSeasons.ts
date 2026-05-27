export type GmarSeasonStatus =
  | "upcoming"
  | "active"
  | "ended";

export type GmarEventStatus =
  | "scheduled"
  | "live"
  | "expired";

export type GmarSeason = {
  seasonId: string;
  title: string;
  status: GmarSeasonStatus;
  rewardPoolReady: true;
  leaderboardReady: true;
  analyticsReady: true;
  startedAt: string;
  endsAt: string;
};

export type GmarLiveEvent = {
  eventId: string;
  seasonId: string;
  title: string;
  status: GmarEventStatus;
  participants: number;
  countdownReady: true;
  activationReady: true;
  expiryReady: true;
  rewardsReady: true;
};

export function createGmarSeason(input: {
  seasonId: string;
  title: string;
  startedAt: string;
  endsAt: string;
}): GmarSeason {
  const seasonId = input.seasonId.trim();

  if (!seasonId) {
    throw new Error("GMAR seasonId is required.");
  }

  return {
    seasonId,
    title: input.title,
    status: "active",
    rewardPoolReady: true,
    leaderboardReady: true,
    analyticsReady: true,
    startedAt: input.startedAt,
    endsAt: input.endsAt
  };
}

export function createGmarLiveEvent(input: {
  eventId: string;
  season: GmarSeason;
  title: string;
}): GmarLiveEvent {
  const eventId = input.eventId.trim();

  if (!eventId) {
    throw new Error("GMAR eventId is required.");
  }

  return {
    eventId,
    seasonId: input.season.seasonId,
    title: input.title,
    status: "scheduled",
    participants: 0,
    countdownReady: true,
    activationReady: true,
    expiryReady: true,
    rewardsReady: true
  };
}

export function activateGmarLiveEvent(
  event: GmarLiveEvent
): GmarLiveEvent {
  return {
    ...event,
    status: "live"
  };
}

export function joinGmarLiveEvent(
  event: GmarLiveEvent
): GmarLiveEvent {
  if (event.status !== "live") {
    throw new Error("GMAR live event is not active.");
  }

  return {
    ...event,
    participants: event.participants + 1
  };
}

export function expireGmarLiveEvent(
  event: GmarLiveEvent
): GmarLiveEvent {
  return {
    ...event,
    status: "expired"
  };
}

export function assertGmarLiveEvent(
  event: GmarLiveEvent
): true {
  if (
    !event.eventId ||
    !event.seasonId ||
    event.countdownReady !== true ||
    event.activationReady !== true ||
    event.expiryReady !== true ||
    event.rewardsReady !== true
  ) {
    throw new Error("Invalid GMAR live event.");
  }

  return true;
}
