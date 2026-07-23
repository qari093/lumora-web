-- PATCH (Step 1795): ensure base table exists for subsequent ALTER TABLE statements
CREATE TABLE IF NOT EXISTS emml_snapshot (
  id TEXT PRIMARY KEY NOT NULL
);
/*
  Warnings:

  - You are about to alter the column `composite` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("json")` to `Json`.
  - You are about to alter the column `indicesJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("json")` to `Json`.
  - You are about to alter the column `marketsJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("json")` to `Json`.
  - You are about to alter the column `metaJson` on the `emml_snapshot` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("json")` to `Json`.
  - Added the required column `health` to the `emml_snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heatSampleSize` to the `emml_snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indicesTracked` to the `emml_snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketsOnline` to the `emml_snapshot` table without a default value. This is not possible if the table is not empty.

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
    "composite" TEXT NOT NULL,
    "indicesJson" TEXT NOT NULL,
    "marketsJson" TEXT NOT NULL,
    "metaJson" TEXT NOT NULL
);
INSERT INTO "new_emml_snapshot" ("composite", "id", "indicesJson", "marketsJson", "metaJson", "updatedAt") SELECT "composite", "id", "indicesJson", "marketsJson", "metaJson", "updatedAt" FROM "emml_snapshot";
DROP TABLE "emml_snapshot";
ALTER TABLE "new_emml_snapshot" RENAME TO "emml_snapshot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
