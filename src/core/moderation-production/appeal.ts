import { prisma } from "@/lib/prisma";

export const MODERATION_APPEAL_PENDING = "pending";
export const MODERATION_APPEAL_APPROVED = "approved";
export const MODERATION_APPEAL_REJECTED = "rejected";

export type ModerationAppealDecision =
  | typeof MODERATION_APPEAL_APPROVED
  | typeof MODERATION_APPEAL_REJECTED;

type AuditEvent = {
  type: string;
  at: string;
  actorUserId: string;
  actorEmail?: string | null;
  reason?: string | null;
  status?: string | null;
  remedy?: string | null;
};

function normalizedAuditHistory(value: unknown): AuditEvent[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (entry): entry is AuditEvent =>
      Boolean(entry) &&
      typeof entry === "object" &&
      typeof (entry as AuditEvent).type === "string" &&
      typeof (entry as AuditEvent).at === "string" &&
      typeof (entry as AuditEvent).actorUserId === "string"
  );
}

export type ModerationAppealTargetErrorCode =
  | "APPEAL_TARGET_NOT_FOUND"
  | "APPEAL_TARGET_FORBIDDEN"
  | "APPEAL_TARGET_NOT_APPEALABLE";

export class ModerationAppealTargetError extends Error {
  readonly code: ModerationAppealTargetErrorCode;

  constructor(code: ModerationAppealTargetErrorCode) {
    super(code);
    this.name = "ModerationAppealTargetError";
    this.code = code;
  }
}

export async function createModerationAppeal(input: {
  reportId: string;
  userId: string;
  reason: string;
}) {
  const target = await prisma.streamVideo.findUnique({
    where: {
      uid: input.reportId,
    },
    select: {
      uid: true,
      ownerId: true,
      status: true,
    },
  });

  if (!target) {
    throw new ModerationAppealTargetError("APPEAL_TARGET_NOT_FOUND");
  }

  if (!target.ownerId || target.ownerId !== input.userId) {
    throw new ModerationAppealTargetError("APPEAL_TARGET_FORBIDDEN");
  }

  if (target.status !== "rejected") {
    throw new ModerationAppealTargetError(
      "APPEAL_TARGET_NOT_APPEALABLE"
    );
  }

  const now = new Date().toISOString();

  return prisma.moderationAppeal.create({
    data: {
      reportId: target.uid,
      userId: input.userId,
      reason: input.reason,
      status: MODERATION_APPEAL_PENDING,
      auditHistory: [
        {
          type: "appeal_submitted",
          at: now,
          actorUserId: input.userId,
          reason: input.reason,
          status: MODERATION_APPEAL_PENDING,
        },
      ],
    },
    select: {
      id: true,
      reportId: true,
      reason: true,
      status: true,
      decisionReason: true,
      remedy: true,
      createdAt: true,
      updatedAt: true,
      reviewedAt: true,
    },
  });
}

export async function listModerationAppealsForUser(userId: string) {
  return prisma.moderationAppeal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      reportId: true,
      reason: true,
      status: true,
      decisionReason: true,
      remedy: true,
      createdAt: true,
      updatedAt: true,
      reviewedAt: true,
    },
  });
}

export async function listPendingModerationAppealsForAdmin() {
  return prisma.moderationAppeal.findMany({
    where: { status: MODERATION_APPEAL_PENDING },
    orderBy: { createdAt: "asc" },
    take: 100,
    select: {
      id: true,
      reportId: true,
      userId: true,
      reason: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function reviewModerationAppeal(input: {
  appealId: string;
  reviewerUserId: string;
  reviewerEmail: string;
  decision: ModerationAppealDecision;
  decisionReason: string;
  remedy?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.moderationAppeal.findUnique({
      where: { id: input.appealId },
      select: {
        id: true,
        userId: true,
        status: true,
        auditHistory: true,
      },
    });

    if (!existing) {
      return { ok: false as const, error: "APPEAL_NOT_FOUND" as const };
    }

    if (existing.status !== MODERATION_APPEAL_PENDING) {
      return {
        ok: false as const,
        error: "APPEAL_ALREADY_REVIEWED" as const,
      };
    }

    const now = new Date();
    const history = normalizedAuditHistory(existing.auditHistory);

    history.push({
      type: "appeal_reviewed",
      at: now.toISOString(),
      actorUserId: input.reviewerUserId,
      actorEmail: input.reviewerEmail,
      reason: input.decisionReason,
      status: input.decision,
      remedy: input.remedy || null,
    });

    const claimed = await tx.moderationAppeal.updateMany({
      where: {
        id: input.appealId,
        status: MODERATION_APPEAL_PENDING,
      },
      data: {
        status: input.decision,
        reviewerUserId: input.reviewerUserId,
        reviewerEmail: input.reviewerEmail,
        decisionReason: input.decisionReason,
        remedy: input.remedy || null,
        reviewedAt: now,
        auditHistory: history,
      },
    });

    if (claimed.count !== 1) {
      return {
        ok: false as const,
        error: "APPEAL_ALREADY_REVIEWED" as const,
      };
    }

    const appeal = await tx.moderationAppeal.findUnique({
      where: { id: input.appealId },
      select: {
        id: true,
        reportId: true,
        userId: true,
        reason: true,
        status: true,
        reviewerUserId: true,
        reviewerEmail: true,
        decisionReason: true,
        remedy: true,
        createdAt: true,
        updatedAt: true,
        reviewedAt: true,
      },
    });

    if (!appeal) {
      return { ok: false as const, error: "APPEAL_NOT_FOUND" as const };
    }

    return { ok: true as const, appeal };
  });
}
