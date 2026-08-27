CREATE TABLE "ModerationDecisionAudit" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "affectedOwnerId" TEXT,
    "action" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "actorEmail" TEXT,
    "source" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationDecisionAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ModerationDecisionAudit_affectedOwnerId_createdAt_idx"
ON "ModerationDecisionAudit"("affectedOwnerId", "createdAt");

CREATE INDEX "ModerationDecisionAudit_targetType_targetId_createdAt_idx"
ON "ModerationDecisionAudit"("targetType", "targetId", "createdAt");

CREATE INDEX "ModerationDecisionAudit_actorUserId_createdAt_idx"
ON "ModerationDecisionAudit"("actorUserId", "createdAt");
