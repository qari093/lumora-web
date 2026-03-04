-- CreateTable
CREATE TABLE "VibeTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 3,
    "rarity" TEXT NOT NULL DEFAULT 'CORE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VibeTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "vibeId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchMs" INTEGER,
    "entropy" REAL,
    "isPassive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "VibeTransaction_vibeId_fkey" FOREIGN KEY ("vibeId") REFERENCES "VibeTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VibeTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VibeTag_slug_key" ON "VibeTag"("slug");

-- CreateIndex
CREATE INDEX "VibeTransaction_userId_createdAt_idx" ON "VibeTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "VibeTransaction_videoId_createdAt_idx" ON "VibeTransaction"("videoId", "createdAt");

-- CreateIndex
CREATE INDEX "VibeTransaction_vibeId_createdAt_idx" ON "VibeTransaction"("vibeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VibeTransaction_userId_videoId_vibeId_key" ON "VibeTransaction"("userId", "videoId", "vibeId");
