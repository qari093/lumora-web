/*
  Warnings:
  - You are about to alter the column `config` on the `AdminCelebrationControls` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `moodVec` on the `CelebrationEIRollup5m` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `meta` on the `CelebrationReaction` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `meta` on the `EmmlEvent` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `meta` on the `EmmlReading` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `meta` on the `EmotionEvent` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `tags` on the `ReflectionJournal` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `entries` on the `ShadowGarden` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `composite` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `indicesJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `marketsJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `metaJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `meta` on the `persona_assets` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `meta` on the `persona_reaction_mappings` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdminCelebrationControls" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "config" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AdminCelebrationControls" ("config", "id", "updatedAt") SELECT "config", "id", "updatedAt" FROM "AdminCelebrationControls";
DROP TABLE "AdminCelebrationControls";
ALTER TABLE "new_AdminCelebrationControls" RENAME TO "AdminCelebrationControls";
CREATE TABLE "new_CelebrationEIRollup5m" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "celebrationId" TEXT NOT NULL,
    "windowStart" DATETIME NOT NULL,
    "reactions" INTEGER NOT NULL DEFAULT 0,
    "eiScore" REAL NOT NULL DEFAULT 0,
    "moodVec" TEXT,
    "spamDiscarded" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CelebrationEIRollup5m_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CelebrationEIRollup5m" ("celebrationId", "eiScore", "id", "moodVec", "reactions", "spamDiscarded", "windowStart") SELECT "celebrationId", "eiScore", "id", "moodVec", "reactions", "spamDiscarded", "windowStart" FROM "CelebrationEIRollup5m";
DROP TABLE "CelebrationEIRollup5m";
ALTER TABLE "new_CelebrationEIRollup5m" RENAME TO "CelebrationEIRollup5m";
CREATE INDEX "CelebrationEIRollup5m_windowStart_idx" ON "CelebrationEIRollup5m"("windowStart");
CREATE UNIQUE INDEX "CelebrationEIRollup5m_celebrationId_windowStart_key" ON "CelebrationEIRollup5m"("celebrationId", "windowStart");
CREATE TABLE "new_CelebrationReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "celebrationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "emotion" TEXT,
    "intensity" REAL,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CelebrationReaction_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CelebrationReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CelebrationReaction" ("celebrationId", "createdAt", "emotion", "id", "intensity", "kind", "meta", "userId") SELECT "celebrationId", "createdAt", "emotion", "id", "intensity", "kind", "meta", "userId" FROM "CelebrationReaction";
DROP TABLE "CelebrationReaction";
ALTER TABLE "new_CelebrationReaction" RENAME TO "CelebrationReaction";
CREATE INDEX "CelebrationReaction_celebrationId_createdAt_idx" ON "CelebrationReaction"("celebrationId", "createdAt");
CREATE INDEX "CelebrationReaction_userId_createdAt_idx" ON "CelebrationReaction"("userId", "createdAt");
CREATE TABLE "new_EmmlEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "source" TEXT,
    "type" TEXT NOT NULL,
    "emotion" TEXT,
    "intensity" REAL,
    "meta" TEXT
);
INSERT INTO "new_EmmlEvent" ("createdAt", "emotion", "id", "intensity", "meta", "source", "type", "userId") SELECT "createdAt", "emotion", "id", "intensity", "meta", "source", "type", "userId" FROM "EmmlEvent";
DROP TABLE "EmmlEvent";
ALTER TABLE "new_EmmlEvent" RENAME TO "EmmlEvent";
CREATE INDEX "EmmlEvent_createdAt_idx" ON "EmmlEvent"("createdAt");
CREATE INDEX "EmmlEvent_type_emotion_idx" ON "EmmlEvent"("type", "emotion");
CREATE TABLE "new_EmmlReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "indexId" TEXT NOT NULL,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" REAL NOT NULL,
    "meta" TEXT,
    CONSTRAINT "EmmlReading_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "EmmlIndex" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmmlReading" ("id", "indexId", "meta", "ts", "value") SELECT "id", "indexId", "meta", "ts", "value" FROM "EmmlReading";
DROP TABLE "EmmlReading";
ALTER TABLE "new_EmmlReading" RENAME TO "EmmlReading";
CREATE INDEX "EmmlReading_indexId_ts_idx" ON "EmmlReading"("indexId", "ts");
CREATE TABLE "new_EmotionEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "emotion" TEXT,
    "intensity" REAL,
    "userId" TEXT,
    "source" TEXT,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_EmotionEvent" ("createdAt", "emotion", "id", "intensity", "kind", "meta", "source", "userId") SELECT "createdAt", "emotion", "id", "intensity", "kind", "meta", "source", "userId" FROM "EmotionEvent";
DROP TABLE "EmotionEvent";
ALTER TABLE "new_EmotionEvent" RENAME TO "EmotionEvent";
CREATE INDEX "EmotionEvent_createdAt_idx" ON "EmotionEvent"("createdAt");
CREATE INDEX "EmotionEvent_emotion_idx" ON "EmotionEvent"("emotion");
CREATE TABLE "new_ReflectionJournal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "title" TEXT,
    "text" TEXT NOT NULL,
    "mood" TEXT,
    "tags" TEXT,
    "score" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReflectionJournal_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReflectionJournal" ("createdAt", "id", "mood", "score", "tags", "text", "title", "worldId") SELECT "createdAt", "id", "mood", "score", "tags", "text", "title", "worldId" FROM "ReflectionJournal";
DROP TABLE "ReflectionJournal";
ALTER TABLE "new_ReflectionJournal" RENAME TO "ReflectionJournal";
CREATE INDEX "ReflectionJournal_worldId_createdAt_idx" ON "ReflectionJournal"("worldId", "createdAt");
CREATE TABLE "new_ShadowGarden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entries" TEXT NOT NULL,
    "lastEntry" DATETIME
);
INSERT INTO "new_ShadowGarden" ("entries", "id", "lastEntry") SELECT "entries", "id", "lastEntry" FROM "ShadowGarden";
DROP TABLE "ShadowGarden";
ALTER TABLE "new_ShadowGarden" RENAME TO "ShadowGarden";
CREATE TABLE "new_emml_snapshot" (
    "health" TEXT NOT NULL,
    "heatSampleSize" INTEGER NOT NULL,
    "indicesTracked" INTEGER NOT NULL,
    "marketsOnline" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "updatedAt" DATETIME NOT NULL,
    "composite" TEXT DEFAULT '{}',
    "indicesJson" TEXT NOT NULL DEFAULT '{}',
    "marketsJson" TEXT NOT NULL DEFAULT '{}',
    "metaJson" TEXT NOT NULL DEFAULT '{}'
);
INSERT INTO "new_emml_snapshot" ("composite", "createdAt", "health", "heatSampleSize", "id", "indicesJson", "indicesTracked", "marketsJson", "marketsOnline", "metaJson", "updatedAt") SELECT "composite", "createdAt", "health", "heatSampleSize", "id", "indicesJson", "indicesTracked", "marketsJson", "marketsOnline", "metaJson", "updatedAt" FROM "emml_snapshot";
DROP TABLE "emml_snapshot";
ALTER TABLE "new_emml_snapshot" RENAME TO "emml_snapshot";
CREATE TABLE "new_persona_assets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "emotion" TEXT NOT NULL DEFAULT 'NEUTRAL',
    "code" TEXT NOT NULL,
    "label" TEXT,
    "url" TEXT,
    "localPath" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "persona_assets_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "persona_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_persona_assets" ("code", "createdAt", "emotion", "height", "id", "isActive", "kind", "label", "localPath", "meta", "mimeType", "profileId", "sortOrder", "updatedAt", "url", "width") SELECT "code", "createdAt", "emotion", "height", "id", "isActive", "kind", "label", "localPath", "meta", "mimeType", "profileId", "sortOrder", "updatedAt", "url", "width" FROM "persona_assets";
DROP TABLE "persona_assets";
ALTER TABLE "new_persona_assets" RENAME TO "persona_assets";
CREATE INDEX "persona_assets_profileId_kind_emotion_idx" ON "persona_assets"("profileId", "kind", "emotion");
CREATE INDEX "persona_assets_kind_isActive_idx" ON "persona_assets"("kind", "isActive");
CREATE UNIQUE INDEX "persona_assets_profileId_kind_code_key" ON "persona_assets"("profileId", "kind", "code");
CREATE TABLE "new_persona_reaction_mappings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "emotion" TEXT NOT NULL DEFAULT 'NEUTRAL',
    "assetCode" TEXT NOT NULL,
    "intensity" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "persona_reaction_mappings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "persona_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_persona_reaction_mappings" ("assetCode", "createdAt", "emotion", "id", "intensity", "isActive", "meta", "profileId", "reaction", "updatedAt") SELECT "assetCode", "createdAt", "emotion", "id", "intensity", "isActive", "meta", "profileId", "reaction", "updatedAt" FROM "persona_reaction_mappings";
DROP TABLE "persona_reaction_mappings";
ALTER TABLE "new_persona_reaction_mappings" RENAME TO "persona_reaction_mappings";
CREATE INDEX "persona_reaction_mappings_profileId_reaction_idx" ON "persona_reaction_mappings"("profileId", "reaction");
CREATE INDEX "persona_reaction_mappings_profileId_emotion_idx" ON "persona_reaction_mappings"("profileId", "emotion");
CREATE UNIQUE INDEX "persona_reaction_mappings_profileId_reaction_emotion_key" ON "persona_reaction_mappings"("profileId", "reaction", "emotion");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;