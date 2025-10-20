-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dailyBudgetCents" INTEGER NOT NULL,
    "targetingRadiusMiles" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdCreative" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL DEFAULT 'Learn More',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdCreative_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "addressText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WalletLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "refType" TEXT,
    "refId" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletLedger_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WalletTransfer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromWalletId" TEXT NOT NULL,
    "toWalletId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletTransfer_fromWalletId_fkey" FOREIGN KEY ("fromWalletId") REFERENCES "Wallet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WalletTransfer_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES "Wallet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CpvView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "costCents" INTEGER NOT NULL,
    "ledgerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CpvView_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdConversion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "creativeId" TEXT,
    "viewKey" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "rewardCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt");

-- CreateIndex
CREATE INDEX "AdCreative_campaignId_createdAt_idx" ON "AdCreative"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_walletId_createdAt_idx" ON "Transaction"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "AdCampaign_ownerId_idx" ON "AdCampaign"("ownerId");

-- CreateIndex
CREATE INDEX "AdCampaign_status_idx" ON "AdCampaign"("status");

-- CreateIndex
CREATE INDEX "AdCampaign_objective_idx" ON "AdCampaign"("objective");

-- CreateIndex
CREATE INDEX "AdCampaign_createdAt_idx" ON "AdCampaign"("createdAt");

-- CreateIndex
CREATE INDEX "Wallet_ownerId_currency_idx" ON "Wallet"("ownerId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_ownerId_currency_key" ON "Wallet"("ownerId", "currency");

-- CreateIndex
CREATE INDEX "WalletLedger_walletId_createdAt_idx" ON "WalletLedger"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletLedger_type_idx" ON "WalletLedger"("type");

-- CreateIndex
CREATE UNIQUE INDEX "WalletLedger_refType_refId_key" ON "WalletLedger"("refType", "refId");

-- CreateIndex
CREATE INDEX "WalletTransfer_fromWalletId_createdAt_idx" ON "WalletTransfer"("fromWalletId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransfer_toWalletId_createdAt_idx" ON "WalletTransfer"("toWalletId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransfer_createdAt_idx" ON "WalletTransfer"("createdAt");

-- CreateIndex
CREATE INDEX "StripeEvent_createdAt_idx" ON "StripeEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CpvView_idempotencyKey_key" ON "CpvView"("idempotencyKey");

-- CreateIndex
CREATE INDEX "CpvView_campaignId_createdAt_idx" ON "CpvView"("campaignId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdConversion_viewKey_key" ON "AdConversion"("viewKey");

-- CreateIndex
CREATE INDEX "AdConversion_campaignId_eventType_idx" ON "AdConversion"("campaignId", "eventType");
