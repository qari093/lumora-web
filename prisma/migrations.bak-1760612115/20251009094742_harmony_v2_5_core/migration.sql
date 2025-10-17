-- CreateEnum
CREATE TYPE "PulseTxn" AS ENUM ('EARN', 'SPEND', 'BURN', 'ADJUST', 'GRANT');

-- CreateTable
CREATE TABLE "PulseLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PulseTxn" NOT NULL DEFAULT 'EARN',
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PulseLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PulseWallet" (
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "harmonyXp" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PulseWallet_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "EconDaily" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "earnTotal" INTEGER NOT NULL DEFAULT 0,
    "spendTotal" INTEGER NOT NULL DEFAULT 0,
    "burnTotal" INTEGER NOT NULL DEFAULT 0,
    "reserve" INTEGER NOT NULL DEFAULT 0,
    "poolNext" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EconDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treasury" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "reserve" INTEGER NOT NULL DEFAULT 0,
    "poolLive" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Treasury_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PulseLedger_userId_idx" ON "PulseLedger"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EconDaily_day_key" ON "EconDaily"("day");
