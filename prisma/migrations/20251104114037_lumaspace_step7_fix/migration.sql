/*
  Warnings:

  - You are about to drop the column `growth` on the `TreeState` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `TreeState` table. All the data in the column will be lost.
  - You are about to drop the column `vitality` on the `TreeState` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `TreeState` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TreeState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TreeState" ("id", "level", "xp") SELECT "id", "level", "xp" FROM "TreeState";
DROP TABLE "TreeState";
ALTER TABLE "new_TreeState" RENAME TO "TreeState";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
