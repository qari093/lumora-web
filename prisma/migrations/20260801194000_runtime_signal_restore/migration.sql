-- CreateTable
CREATE TABLE "RuntimeSignal" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "timestampMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuntimeSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RuntimeSignal_createdAt_idx" ON "RuntimeSignal"("createdAt");

-- CreateIndex
CREATE INDEX "RuntimeSignal_videoId_createdAt_idx" ON "RuntimeSignal"("videoId", "createdAt");

