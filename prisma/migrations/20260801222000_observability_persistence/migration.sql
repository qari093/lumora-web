-- CreateTable
CREATE TABLE "ObservabilityEvent" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "source" TEXT NOT NULL,
    "route" TEXT,
    "sessionId" TEXT,
    "userId" TEXT,
    "testerId" TEXT,
    "targetId" TEXT,
    "message" TEXT,
    "durationMs" INTEGER,
    "value" DOUBLE PRECISION,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObservabilityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorReport" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'error',
    "name" TEXT,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "route" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "userId" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ObservabilityEvent_category_createdAt_idx" ON "ObservabilityEvent"("category", "createdAt");

-- CreateIndex
CREATE INDEX "ObservabilityEvent_eventType_createdAt_idx" ON "ObservabilityEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "ObservabilityEvent_severity_createdAt_idx" ON "ObservabilityEvent"("severity", "createdAt");

-- CreateIndex
CREATE INDEX "ObservabilityEvent_source_createdAt_idx" ON "ObservabilityEvent"("source", "createdAt");

-- CreateIndex
CREATE INDEX "ObservabilityEvent_route_createdAt_idx" ON "ObservabilityEvent"("route", "createdAt");

-- CreateIndex
CREATE INDEX "ObservabilityEvent_userId_createdAt_idx" ON "ObservabilityEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ObservabilityEvent_testerId_createdAt_idx" ON "ObservabilityEvent"("testerId", "createdAt");

-- CreateIndex
CREATE INDEX "ObservabilityEvent_occurredAt_idx" ON "ObservabilityEvent"("occurredAt");

-- CreateIndex
CREATE INDEX "ErrorReport_level_createdAt_idx" ON "ErrorReport"("level", "createdAt");

-- CreateIndex
CREATE INDEX "ErrorReport_route_createdAt_idx" ON "ErrorReport"("route", "createdAt");

-- CreateIndex
CREATE INDEX "ErrorReport_userId_createdAt_idx" ON "ErrorReport"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ErrorReport_occurredAt_idx" ON "ErrorReport"("occurredAt");

