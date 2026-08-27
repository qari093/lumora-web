BEGIN;

CREATE TABLE "LumaLinkConnection" (
  "id" TEXT NOT NULL,
  "pairKey" TEXT NOT NULL,
  "requesterId" TEXT NOT NULL,
  "recipientId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LumaLinkConnection_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LumaLinkConnection_pairKey_key"
ON "LumaLinkConnection"("pairKey");

CREATE INDEX "LumaLinkConnection_requesterId_updatedAt_idx"
ON "LumaLinkConnection"("requesterId", "updatedAt");

CREATE INDEX "LumaLinkConnection_recipientId_updatedAt_idx"
ON "LumaLinkConnection"("recipientId", "updatedAt");

CREATE TABLE "LumaLinkGroup" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LumaLinkGroup_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LumaLinkGroup_ownerId_updatedAt_idx"
ON "LumaLinkGroup"("ownerId", "updatedAt");

CREATE TABLE "LumaLinkGroupMember" (
  "id" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LumaLinkGroupMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LumaLinkGroupMember_groupId_userId_key"
ON "LumaLinkGroupMember"("groupId", "userId");

CREATE INDEX "LumaLinkGroupMember_userId_createdAt_idx"
ON "LumaLinkGroupMember"("userId", "createdAt");

CREATE TABLE "LumaLinkMessage" (
  "id" TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "recipientId" TEXT,
  "groupId" TEXT,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LumaLinkMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LumaLinkMessage_conversationId_createdAt_idx"
ON "LumaLinkMessage"("conversationId", "createdAt");

CREATE INDEX "LumaLinkMessage_senderId_createdAt_idx"
ON "LumaLinkMessage"("senderId", "createdAt");

CREATE TABLE "LumaLinkPresence" (
  "userId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'offline',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LumaLinkPresence_pkey" PRIMARY KEY ("userId")
);

ALTER TABLE "LumaLinkGroupMember"
ADD CONSTRAINT "LumaLinkGroupMember_groupId_fkey"
FOREIGN KEY ("groupId")
REFERENCES "LumaLinkGroup"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

COMMIT;
