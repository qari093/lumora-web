-- CreateEnum
CREATE TYPE "PrivateBetaAccessStatus" AS ENUM ('PENDING', 'APPROVED', 'REVOKED');

-- CreateTable
CREATE TABLE "PrivateBetaAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "inviteCodeHash" TEXT,
    "status" "PrivateBetaAccessStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateBetaAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateBetaAccess_userId_key" ON "PrivateBetaAccess"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateBetaAccess_email_key" ON "PrivateBetaAccess"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateBetaAccess_inviteCodeHash_key" ON "PrivateBetaAccess"("inviteCodeHash");

-- CreateIndex
CREATE INDEX "PrivateBetaAccess_status_idx" ON "PrivateBetaAccess"("status");

-- CreateIndex
CREATE INDEX "PrivateBetaAccess_createdAt_idx" ON "PrivateBetaAccess"("createdAt");

-- AddForeignKey
ALTER TABLE "PrivateBetaAccess" ADD CONSTRAINT "PrivateBetaAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

