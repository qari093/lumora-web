-- CreateTable
CREATE TABLE "AdCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "creativeType" TEXT NOT NULL,
    "creativeUrl" TEXT NOT NULL,
    "landingUrl" TEXT,
    "dailyBudgetCents" INTEGER NOT NULL,
    "totalBudgetCents" INTEGER NOT NULL,
    "radiusKm" INTEGER NOT NULL DEFAULT 50,
    "centerLat" REAL,
    "centerLon" REAL,
    "locationsJson" TEXT,
    "startAt" DATETIME,
    "endAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
