-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "mood" TEXT,
    "ms" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);
