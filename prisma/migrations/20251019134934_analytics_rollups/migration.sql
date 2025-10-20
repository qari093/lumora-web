-- CreateTable
CREATE TABLE "AdMetricDaily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" DATETIME NOT NULL,
    "campaignId" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "hovers" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "spendCents" INTEGER NOT NULL DEFAULT 0,
    "rewardsCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "AdMetricDaily_day_idx" ON "AdMetricDaily"("day");

-- CreateIndex
CREATE INDEX "AdMetricDaily_campaignId_day_idx" ON "AdMetricDaily"("campaignId", "day");
