-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TreeState" (
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "id" TEXT NOT NULL PRIMARY KEY,
    "stage" INTEGER NOT NULL DEFAULT 1,
    "growth" REAL NOT NULL DEFAULT 0.0,
    "vitality" REAL NOT NULL DEFAULT 0.5
);
INSERT INTO "new_TreeState" ("growth", "id", "stage", "vitality") SELECT "growth", "id", "stage", "vitality" FROM "TreeState";
DROP TABLE "TreeState";
ALTER TABLE "new_TreeState" RENAME TO "TreeState";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
