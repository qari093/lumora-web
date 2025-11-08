-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Capsule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'video',
    "mediaUrl" TEXT,
    "caption" TEXT,
    "emotion" TEXT,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Capsule_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Capsule" ("caption", "emotion", "id", "mediaUrl", "ts", "type", "worldId") SELECT "caption", "emotion", "id", "mediaUrl", "ts", "type", "worldId" FROM "Capsule";
DROP TABLE "Capsule";
ALTER TABLE "new_Capsule" RENAME TO "Capsule";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
