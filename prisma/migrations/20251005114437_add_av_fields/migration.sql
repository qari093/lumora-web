-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'CLEAN', 'INFECTED');

-- AlterTable
ALTER TABLE "ModerationItem" ADD COLUMN     "fileKey" TEXT,
ADD COLUMN     "scanAt" TIMESTAMP(3),
ADD COLUMN     "scanStatus" "ScanStatus",
ADD COLUMN     "sha256" TEXT;
