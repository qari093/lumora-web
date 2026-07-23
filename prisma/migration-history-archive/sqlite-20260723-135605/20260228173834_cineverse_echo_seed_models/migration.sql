-- CreateTable
CREATE TABLE "CineverseMovie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EchoTrack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
