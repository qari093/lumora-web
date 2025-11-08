-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntent" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmotionBaselineWeight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emotion" TEXT NOT NULL,
    "weight" REAL NOT NULL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmmlEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "source" TEXT,
    "type" TEXT NOT NULL,
    "emotion" TEXT,
    "intensity" REAL,
    "meta" JSONB
);

-- CreateTable
CREATE TABLE "EmotionEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "emotion" TEXT,
    "intensity" REAL,
    "userId" TEXT,
    "source" TEXT,
    "meta" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmotionIndexDaily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" DATETIME NOT NULL,
    "emotion" TEXT NOT NULL,
    "ei" REAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "avgIntensity" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "EmotionMarketTick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emotion" TEXT,
    "ei" REAL NOT NULL,
    "globalEi" REAL,
    "zenMultiplier" REAL
);

-- CreateTable
CREATE TABLE "ZenOracle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "zenMultiplier" REAL NOT NULL,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "ZenBurn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" REAL NOT NULL,
    "reason" TEXT,
    "tickId" TEXT
);

-- CreateTable
CREATE TABLE "ZenReissue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" REAL NOT NULL,
    "reason" TEXT,
    "tickId" TEXT
);

-- CreateTable
CREATE TABLE "EmotionStake" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "amount" REAL NOT NULL DEFAULT 0,
    "windowStart" DATETIME NOT NULL,
    "windowEnd" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmotionDividend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "reason" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Celebration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "startAt" DATETIME,
    "endAt" DATETIME,
    "themeKey" TEXT,
    "goalPulse" INTEGER DEFAULT 0,
    "budgetZencoin" INTEGER DEFAULT 0,
    "allowInvites" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Celebration_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CelebrationInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "celebrationId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviteeId" TEXT,
    "inviteeEmail" TEXT,
    "role" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CelebrationInvite_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CelebrationInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CelebrationInvite_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CelebrationParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "celebrationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CelebrationParticipant_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CelebrationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CelebrationReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "celebrationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "emotion" TEXT,
    "intensity" REAL,
    "meta" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CelebrationReaction_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CelebrationReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CelebrationEIRollup5m" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "celebrationId" TEXT NOT NULL,
    "windowStart" DATETIME NOT NULL,
    "reactions" INTEGER NOT NULL DEFAULT 0,
    "eiScore" REAL NOT NULL DEFAULT 0,
    "moodVec" JSONB,
    "spamDiscarded" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CelebrationEIRollup5m_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CelebrationReward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "celebrationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "zencoin" INTEGER NOT NULL DEFAULT 0,
    "pulse" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT,
    "ledgerTxId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CelebrationReward_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CelebrationReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CelebrationStreak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 0,
    "lastCelebrationAt" DATETIME,
    CONSTRAINT "CelebrationStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CelebrationBadge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "awardedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CelebrationBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminCelebrationControls" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "config" JSONB,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GlobalNowLiveTicker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "liveCount" INTEGER NOT NULL DEFAULT 0,
    "topCelebrationId" TEXT,
    "eiIndex" REAL NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CelebrationShow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "celebrationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "timezone" TEXT,
    "hostId" TEXT,
    "hostName" TEXT,
    "hostAvatarUrl" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CelebrationShow_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CelebrationShowGuest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "showId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" TEXT,
    CONSTRAINT "CelebrationShowGuest_showId_fkey" FOREIGN KEY ("showId") REFERENCES "CelebrationShow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmmlIndex" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmmlReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "indexId" TEXT NOT NULL,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" REAL NOT NULL,
    "meta" JSONB,
    CONSTRAINT "EmmlReading_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "EmmlIndex" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmmlMarket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmmlAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marketId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 2,
    "supply" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmmlAsset_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "EmmlMarket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmmlTick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" REAL NOT NULL,
    "volume" REAL,
    CONSTRAINT "EmmlTick_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "EmmlAsset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserWorld" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "mood" TEXT NOT NULL DEFAULT 'neutral',
    "auraId" TEXT,
    "treeId" TEXT,
    "shadowId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserWorld_auraId_fkey" FOREIGN KEY ("auraId") REFERENCES "Aura" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "UserWorld_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "TreeState" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "UserWorld_shadowId_fkey" FOREIGN KEY ("shadowId") REFERENCES "ShadowGarden" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmotionMirror" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "intensity" REAL NOT NULL,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmotionMirror_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Capsule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "caption" TEXT,
    "emotion" TEXT,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Capsule_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Aura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "color" TEXT NOT NULL,
    "intensity" REAL NOT NULL DEFAULT 0.5,
    "balance" REAL NOT NULL DEFAULT 0.5
);

-- CreateTable
CREATE TABLE "TreeState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stage" INTEGER NOT NULL DEFAULT 1,
    "growth" REAL NOT NULL DEFAULT 0.0,
    "vitality" REAL NOT NULL DEFAULT 0.5
);

-- CreateTable
CREATE TABLE "ShadowGarden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entries" JSONB NOT NULL,
    "lastEntry" DATETIME
);

-- CreateTable
CREATE TABLE "ZenLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "zenId" TEXT NOT NULL,
    "pulses" INTEGER NOT NULL DEFAULT 0,
    "multiplier" REAL NOT NULL DEFAULT 1.0,
    CONSTRAINT "ZenLink_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditTransaction_stripeSessionId_key" ON "CreditTransaction"("stripeSessionId");

-- CreateIndex
CREATE INDEX "CreditTransaction_accountId_idx" ON "CreditTransaction"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "EmotionBaselineWeight_emotion_key" ON "EmotionBaselineWeight"("emotion");

-- CreateIndex
CREATE INDEX "EmmlEvent_createdAt_idx" ON "EmmlEvent"("createdAt");

-- CreateIndex
CREATE INDEX "EmmlEvent_type_emotion_idx" ON "EmmlEvent"("type", "emotion");

-- CreateIndex
CREATE INDEX "EmotionEvent_createdAt_idx" ON "EmotionEvent"("createdAt");

-- CreateIndex
CREATE INDEX "EmotionEvent_emotion_idx" ON "EmotionEvent"("emotion");

-- CreateIndex
CREATE INDEX "EmotionIndexDaily_emotion_day_idx" ON "EmotionIndexDaily"("emotion", "day");

-- CreateIndex
CREATE UNIQUE INDEX "EmotionIndexDaily_day_emotion_key" ON "EmotionIndexDaily"("day", "emotion");

-- CreateIndex
CREATE INDEX "EmotionMarketTick_ts_idx" ON "EmotionMarketTick"("ts");

-- CreateIndex
CREATE INDEX "EmotionStake_userId_status_idx" ON "EmotionStake"("userId", "status");

-- CreateIndex
CREATE INDEX "EmotionStake_emotion_windowStart_windowEnd_idx" ON "EmotionStake"("emotion", "windowStart", "windowEnd");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Celebration_slug_key" ON "Celebration"("slug");

-- CreateIndex
CREATE INDEX "Celebration_organizerId_status_idx" ON "Celebration"("organizerId", "status");

-- CreateIndex
CREATE INDEX "Celebration_status_startAt_idx" ON "Celebration"("status", "startAt");

-- CreateIndex
CREATE INDEX "CelebrationInvite_celebrationId_status_idx" ON "CelebrationInvite"("celebrationId", "status");

-- CreateIndex
CREATE INDEX "CelebrationParticipant_userId_joinedAt_idx" ON "CelebrationParticipant"("userId", "joinedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CelebrationParticipant_celebrationId_userId_key" ON "CelebrationParticipant"("celebrationId", "userId");

-- CreateIndex
CREATE INDEX "CelebrationReaction_celebrationId_createdAt_idx" ON "CelebrationReaction"("celebrationId", "createdAt");

-- CreateIndex
CREATE INDEX "CelebrationReaction_userId_createdAt_idx" ON "CelebrationReaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CelebrationEIRollup5m_windowStart_idx" ON "CelebrationEIRollup5m"("windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "CelebrationEIRollup5m_celebrationId_windowStart_key" ON "CelebrationEIRollup5m"("celebrationId", "windowStart");

-- CreateIndex
CREATE INDEX "CelebrationReward_celebrationId_createdAt_idx" ON "CelebrationReward"("celebrationId", "createdAt");

-- CreateIndex
CREATE INDEX "CelebrationReward_userId_createdAt_idx" ON "CelebrationReward"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CelebrationStreak_userId_key" ON "CelebrationStreak"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CelebrationBadge_userId_type_key" ON "CelebrationBadge"("userId", "type");

-- CreateIndex
CREATE INDEX "CelebrationShow_celebrationId_idx" ON "CelebrationShow"("celebrationId");

-- CreateIndex
CREATE INDEX "CelebrationShow_startAt_idx" ON "CelebrationShow"("startAt");

-- CreateIndex
CREATE INDEX "CelebrationShow_endAt_idx" ON "CelebrationShow"("endAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmmlIndex_slug_key" ON "EmmlIndex"("slug");

-- CreateIndex
CREATE INDEX "EmmlReading_indexId_ts_idx" ON "EmmlReading"("indexId", "ts");

-- CreateIndex
CREATE UNIQUE INDEX "EmmlMarket_slug_key" ON "EmmlMarket"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EmmlAsset_marketId_symbol_key" ON "EmmlAsset"("marketId", "symbol");

-- CreateIndex
CREATE INDEX "EmmlTick_assetId_ts_idx" ON "EmmlTick"("assetId", "ts");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorld_userId_key" ON "UserWorld"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorld_auraId_key" ON "UserWorld"("auraId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorld_treeId_key" ON "UserWorld"("treeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorld_shadowId_key" ON "UserWorld"("shadowId");

-- CreateIndex
CREATE UNIQUE INDEX "ZenLink_worldId_key" ON "ZenLink"("worldId");
