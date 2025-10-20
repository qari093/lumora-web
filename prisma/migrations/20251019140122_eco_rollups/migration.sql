-- CreateTable
CREATE TABLE "EcoMetricDaily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" DATETIME NOT NULL,
    "campaignId" TEXT,
    "co2g" REAL NOT NULL DEFAULT 0,
    "energyWh" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "EcoMetricDaily_day_idx" ON "EcoMetricDaily"("day");

-- CreateIndex
CREATE INDEX "EcoMetricDaily_campaignId_day_idx" ON "EcoMetricDaily"("campaignId", "day");
