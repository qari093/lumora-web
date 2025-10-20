-- CreateTable
CREATE TABLE "FraudEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "reason" TEXT,
    "ip" TEXT,
    "userId" TEXT,
    "viewKey" TEXT,
    "score" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IpBlock" (
    "ip" TEXT NOT NULL PRIMARY KEY,
    "reason" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KeyCounter" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "FraudEvent_createdAt_idx" ON "FraudEvent"("createdAt");

-- CreateIndex
CREATE INDEX "FraudEvent_ip_createdAt_idx" ON "FraudEvent"("ip", "createdAt");

-- CreateIndex
CREATE INDEX "KeyCounter_updatedAt_idx" ON "KeyCounter"("updatedAt");
