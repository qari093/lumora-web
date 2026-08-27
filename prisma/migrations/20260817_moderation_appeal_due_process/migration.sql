CREATE TABLE "ModerationAppeal" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewerUserId" TEXT,
    "reviewerEmail" TEXT,
    "decisionReason" TEXT,
    "remedy" TEXT,
    "auditHistory" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ModerationAppeal_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ModerationAppeal_userId_createdAt_idx"
ON "ModerationAppeal"("userId", "createdAt");

CREATE INDEX "ModerationAppeal_reportId_idx"
ON "ModerationAppeal"("reportId");

CREATE INDEX "ModerationAppeal_status_createdAt_idx"
ON "ModerationAppeal"("status", "createdAt");
