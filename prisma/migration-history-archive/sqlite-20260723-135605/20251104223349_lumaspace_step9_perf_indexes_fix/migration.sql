-- CreateIndex
CREATE INDEX "ReflectionJournal_worldId_createdAt_idx" ON "ReflectionJournal"("worldId", "createdAt");

-- CreateIndex
CREATE INDEX "ShadowJournal_worldId_createdAt_idx" ON "ShadowJournal"("worldId", "createdAt");
