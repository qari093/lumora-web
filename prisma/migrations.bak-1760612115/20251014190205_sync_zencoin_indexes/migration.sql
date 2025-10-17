/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AnalyticsEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EconDaily` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModerationItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PulseLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PulseWallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RenderJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoomMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Treasury` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_actorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_roomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_hostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RoomMember" DROP CONSTRAINT "RoomMember_roomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RoomMember" DROP CONSTRAINT "RoomMember_userId_fkey";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "passwordHash",
DROP COLUMN "updatedAt",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."AnalyticsEvent";

-- DropTable
DROP TABLE "public"."EconDaily";

-- DropTable
DROP TABLE "public"."Event";

-- DropTable
DROP TABLE "public"."Interaction";

-- DropTable
DROP TABLE "public"."Message";

-- DropTable
DROP TABLE "public"."ModerationItem";

-- DropTable
DROP TABLE "public"."PulseLedger";

-- DropTable
DROP TABLE "public"."PulseWallet";

-- DropTable
DROP TABLE "public"."RenderJob";

-- DropTable
DROP TABLE "public"."Room";

-- DropTable
DROP TABLE "public"."RoomMember";

-- DropTable
DROP TABLE "public"."Treasury";

-- DropTable
DROP TABLE "public"."Video";

-- DropEnum
DROP TYPE "public"."ModerationKind";

-- DropEnum
DROP TYPE "public"."ModerationStatus";

-- DropEnum
DROP TYPE "public"."PulseTxn";

-- DropEnum
DROP TYPE "public"."RenderStatus";

-- DropEnum
DROP TYPE "public"."ScanStatus";

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinTx" (
    "id" TEXT NOT NULL,
    "fromId" TEXT,
    "toId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinTx_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ledger_toId_createdAt_idx" ON "Ledger"("toId", "createdAt");

-- CreateIndex
CREATE INDEX "Ledger_fromId_createdAt_idx" ON "Ledger"("fromId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoinAccount_userId_key" ON "CoinAccount"("userId");

-- CreateIndex
CREATE INDEX "CoinAccount_createdAt_idx" ON "CoinAccount"("createdAt");

-- CreateIndex
CREATE INDEX "CoinTx_toId_createdAt_idx" ON "CoinTx"("toId", "createdAt");

-- CreateIndex
CREATE INDEX "CoinTx_fromId_createdAt_idx" ON "CoinTx"("fromId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTx" ADD CONSTRAINT "CoinTx_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "CoinAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTx" ADD CONSTRAINT "CoinTx_toId_fkey" FOREIGN KEY ("toId") REFERENCES "CoinAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
