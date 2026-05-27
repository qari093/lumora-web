export type GmarCreatorContentStatus =
  | "draft"
  | "review"
  | "approved"
  | "rejected"
  | "published";

export type GmarCreatorProfile = {
  creatorId: string;
  playerId: string;
  displayName: string;
  monetizationEnabled: boolean;
  analyticsReady: true;
  moderationReady: true;
};

export type GmarCreatorContent = {
  contentId: string;
  creatorId: string;
  title: string;
  description: string;
  status: GmarCreatorContentStatus;
  reviewRequired: true;
  moderationPassed: boolean;
  analyticsTracked: true;
  publishedAt: string | null;
};

export function createGmarCreatorProfile(input: {
  creatorId: string;
  playerId: string;
  displayName: string;
}): GmarCreatorProfile {
  const creatorId = input.creatorId.trim();
  const playerId = input.playerId.trim();
  const displayName = input.displayName.trim();

  if (!creatorId || !playerId || !displayName) {
    throw new Error("GMAR creator profile requires creatorId, playerId, and displayName.");
  }

  return {
    creatorId,
    playerId,
    displayName,
    monetizationEnabled: true,
    analyticsReady: true,
    moderationReady: true
  };
}

export function createGmarCreatorDraft(input: {
  contentId: string;
  creator: GmarCreatorProfile;
  title: string;
  description: string;
}): GmarCreatorContent {
  const contentId = input.contentId.trim();
  const title = input.title.trim();
  const description = input.description.trim();

  if (!contentId || !title || !description) {
    throw new Error("GMAR creator draft requires contentId, title, and description.");
  }

  return {
    contentId,
    creatorId: input.creator.creatorId,
    title,
    description,
    status: "draft",
    reviewRequired: true,
    moderationPassed: false,
    analyticsTracked: true,
    publishedAt: null
  };
}

export function submitGmarCreatorDraft(
  draft: GmarCreatorContent
): GmarCreatorContent {
  return {
    ...draft,
    status: "review"
  };
}

export function approveGmarCreatorDraft(
  draft: GmarCreatorContent
): GmarCreatorContent {
  if (draft.status !== "review") {
    throw new Error("GMAR creator draft must be in review state.");
  }

  return {
    ...draft,
    status: "approved",
    moderationPassed: true
  };
}

export function publishGmarCreatorContent(input: {
  content: GmarCreatorContent;
  now?: Date;
}): GmarCreatorContent {
  if (input.content.status !== "approved") {
    throw new Error("GMAR creator content must be approved before publishing.");
  }

  return {
    ...input.content,
    status: "published",
    publishedAt: (input.now ?? new Date()).toISOString()
  };
}

export function assertGmarCreatorContent(
  content: GmarCreatorContent
): true {
  if (
    !content.contentId ||
    !content.creatorId ||
    !content.title ||
    content.analyticsTracked !== true
  ) {
    throw new Error("Invalid GMAR creator content.");
  }

  return true;
}
