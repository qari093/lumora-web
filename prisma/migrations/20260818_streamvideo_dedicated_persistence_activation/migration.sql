CREATE TABLE "StreamVideo" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "ownerId" TEXT,
    "readyToStream" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "durationSec" INTEGER,
    "sizeBytes" INTEGER,
    "thumbnailUrl" TEXT,
    "playbackId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamVideo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StreamVideo_uid_key"
ON "StreamVideo"("uid");

CREATE INDEX "StreamVideo_ownerId_createdAt_idx"
ON "StreamVideo"("ownerId", "createdAt");

CREATE INDEX "StreamVideo_status_createdAt_idx"
ON "StreamVideo"("status", "createdAt");
