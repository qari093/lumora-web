-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('fan', 'creator', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ZendoroOrderStatus" AS ENUM ('DRAFT', 'PENDING', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ZendoroPaymentStatus" AS ENUM ('CREATED', 'REQUIRES_ACTION', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ZendoroSellerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'fan',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "visibility" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "postId" TEXT,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionTier" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "monthlyCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedMoment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "postId" TEXT,
    "timestampMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedMoment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "status" "SellerStatus" NOT NULL DEFAULT 'PENDING',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "lowStockAt" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerRef" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" "RefundStatus" NOT NULL DEFAULT 'REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Return" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reason" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Return_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "carrier" TEXT,
    "trackingNumber" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroSeller" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" "ZendoroSellerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZendoroSeller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroProduct" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZendoroProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroCart" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZendoroCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroCartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,

    CONSTRAINT "ZendoroCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroOrder" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "status" "ZendoroOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZendoroOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "ZendoroOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroPayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "providerPaymentId" TEXT,
    "status" "ZendoroPaymentStatus" NOT NULL DEFAULT 'CREATED',
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZendoroPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroRefund" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZendoroRefund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroReturn" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZendoroReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroShipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZendoroShipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroPayout" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZendoroPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroReview" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZendoroReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZendoroInventory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZendoroInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeCheckoutSession" (
    "id" TEXT NOT NULL,
    "stripeSession" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "credits" INTEGER,
    "amountCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeCheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_userId_key" ON "Creator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_slug_key" ON "Creator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "Seller"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_slug_key" ON "Seller"("slug");

-- CreateIndex
CREATE INDEX "Seller_status_idx" ON "Seller"("status");

-- CreateIndex
CREATE INDEX "Seller_slug_idx" ON "Seller"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sku_key" ON "Inventory"("sku");

-- CreateIndex
CREATE INDEX "Inventory_sellerId_idx" ON "Inventory"("sellerId");

-- CreateIndex
CREATE INDEX "Inventory_productId_idx" ON "Inventory"("productId");

-- CreateIndex
CREATE INDEX "Inventory_sku_idx" ON "Inventory"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_productId_idx" ON "CartItem"("productId");

-- CreateIndex
CREATE INDEX "Order_sellerId_idx" ON "Order"("sellerId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Refund_orderId_idx" ON "Refund"("orderId");

-- CreateIndex
CREATE INDEX "Refund_status_idx" ON "Refund"("status");

-- CreateIndex
CREATE INDEX "Return_orderId_idx" ON "Return"("orderId");

-- CreateIndex
CREATE INDEX "Shipment_orderId_idx" ON "Shipment"("orderId");

-- CreateIndex
CREATE INDEX "Shipment_trackingNumber_idx" ON "Shipment"("trackingNumber");

-- CreateIndex
CREATE INDEX "Payout_sellerId_idx" ON "Payout"("sellerId");

-- CreateIndex
CREATE INDEX "Review_sellerId_idx" ON "Review"("sellerId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ZendoroSeller_slug_key" ON "ZendoroSeller"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ZendoroProduct_slug_key" ON "ZendoroProduct"("slug");

-- CreateIndex
CREATE INDEX "ZendoroProduct_sellerId_idx" ON "ZendoroProduct"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "ZendoroCartItem_cartId_productId_key" ON "ZendoroCartItem"("cartId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ZendoroOrder_idempotencyKey_key" ON "ZendoroOrder"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ZendoroOrderItem_orderId_idx" ON "ZendoroOrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ZendoroPayment_providerPaymentId_key" ON "ZendoroPayment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "ZendoroPayment_orderId_idx" ON "ZendoroPayment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ZendoroInventory_productId_key" ON "ZendoroInventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeCheckoutSession_stripeSession_key" ON "StripeCheckoutSession"("stripeSession");

-- CreateIndex
CREATE INDEX "StripeCheckoutSession_userId_idx" ON "StripeCheckoutSession"("userId");

-- CreateIndex
CREATE INDEX "StripeCheckoutSession_status_idx" ON "StripeCheckoutSession"("status");

-- CreateIndex
CREATE INDEX "StripeCheckoutSession_createdAt_idx" ON "StripeCheckoutSession"("createdAt");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionTier" ADD CONSTRAINT "SubscriptionTier_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "SubscriptionTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedMoment" ADD CONSTRAINT "SavedMoment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedMoment" ADD CONSTRAINT "SavedMoment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroProduct" ADD CONSTRAINT "ZendoroProduct_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "ZendoroSeller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroCartItem" ADD CONSTRAINT "ZendoroCartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "ZendoroCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroCartItem" ADD CONSTRAINT "ZendoroCartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ZendoroProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroOrderItem" ADD CONSTRAINT "ZendoroOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ZendoroOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroOrderItem" ADD CONSTRAINT "ZendoroOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ZendoroProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroPayment" ADD CONSTRAINT "ZendoroPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ZendoroOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroRefund" ADD CONSTRAINT "ZendoroRefund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ZendoroOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroReturn" ADD CONSTRAINT "ZendoroReturn_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ZendoroOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroShipment" ADD CONSTRAINT "ZendoroShipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ZendoroOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroPayout" ADD CONSTRAINT "ZendoroPayout_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "ZendoroSeller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroReview" ADD CONSTRAINT "ZendoroReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ZendoroProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZendoroInventory" ADD CONSTRAINT "ZendoroInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ZendoroProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
