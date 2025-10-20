-- CreateTable
CREATE TABLE "KycRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "fullName" TEXT,
    "dob" TEXT,
    "idType" TEXT,
    "idNumber" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "adminUser" TEXT,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "original" TEXT,
    "size" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KycDocument_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "KycRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "KycRequest_ownerId_status_idx" ON "KycRequest"("ownerId", "status");

-- CreateIndex
CREATE INDEX "KycRequest_createdAt_idx" ON "KycRequest"("createdAt");

-- CreateIndex
CREATE INDEX "KycDocument_requestId_docType_idx" ON "KycDocument"("requestId", "docType");
