-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "cfUid" TEXT NOT NULL,
    "playbackId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "durationSec" INTEGER,
    "sizeBytes" INTEGER,
    "creatorId" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_cfUid_key" ON "Video"("cfUid");

-- CreateIndex
CREATE UNIQUE INDEX "Video_playbackId_key" ON "Video"("playbackId");
