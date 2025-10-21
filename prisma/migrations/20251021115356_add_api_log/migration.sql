-- CreateTable
CREATE TABLE "ApiLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "requestId" TEXT,
    "durationMs" INTEGER NOT NULL,
    "ownerId" TEXT,
    "publisher" TEXT,
    "ip" TEXT,
    "ua" TEXT
);

-- CreateIndex
CREATE INDEX "ApiLog_ts_idx" ON "ApiLog"("ts");

-- CreateIndex
CREATE INDEX "ApiLog_requestId_idx" ON "ApiLog"("requestId");

-- CreateIndex
CREATE INDEX "ApiLog_path_ts_idx" ON "ApiLog"("path", "ts");
