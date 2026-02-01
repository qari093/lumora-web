-- CreateTable
CREATE TABLE "StripeCheckoutSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "stripeSession" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "currency" TEXT DEFAULT 'eur',
    "amountCents" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeCheckoutSession_stripeSession_key" ON "StripeCheckoutSession"("stripeSession");

-- CreateIndex
CREATE INDEX "StripeCheckoutSession_userId_createdAt_idx" ON "StripeCheckoutSession"("userId", "createdAt");
