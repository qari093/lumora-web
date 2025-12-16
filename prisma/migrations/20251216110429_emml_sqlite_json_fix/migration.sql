/*
  Warnings:

  - You are about to alter the column `composite` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `indicesJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `marketsJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `metaJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
