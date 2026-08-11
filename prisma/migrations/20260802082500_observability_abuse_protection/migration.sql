-- CreateTable
CREATE TABLE "ObservabilityRateLimitBucket" (
    "key" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObservabilityRateLimitBucket_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "ObservabilityRateLimitBucket_scope_windowStart_idx" ON "ObservabilityRateLimitBucket"("scope", "windowStart");

-- CreateIndex
CREATE INDEX "ObservabilityRateLimitBucket_expiresAt_idx" ON "ObservabilityRateLimitBucket"("expiresAt");

