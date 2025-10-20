-- CreateTable
CREATE TABLE "AdEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "viewKey" TEXT,
    "userId" TEXT,
    "campaignId" TEXT,
    "ms" INTEGER,
    "mood" TEXT,
    "metaJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "AdEvent_action_createdAt_idx" ON "AdEvent"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AdEvent_viewKey_createdAt_idx" ON "AdEvent"("viewKey", "createdAt");

-- CreateIndex
CREATE INDEX "AdEvent_campaignId_createdAt_idx" ON "AdEvent"("campaignId", "createdAt");
