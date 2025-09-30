-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomSlug" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "giftType" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Gift_roomSlug_fkey" FOREIGN KEY ("roomSlug") REFERENCES "Room" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Nft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomSlug" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Nft_roomSlug_fkey" FOREIGN KEY ("roomSlug") REFERENCES "Room" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "meta" TEXT,
    "roomSlug" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");

-- CreateIndex
CREATE INDEX "Gift_roomSlug_createdAt_idx" ON "Gift"("roomSlug", "createdAt");

-- CreateIndex
CREATE INDEX "Nft_roomSlug_createdAt_idx" ON "Nft"("roomSlug", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_token_key" ON "Wallet"("userId", "token");

-- CreateIndex
CREATE INDEX "LedgerEntry_userId_token_ts_idx" ON "LedgerEntry"("userId", "token", "ts");
