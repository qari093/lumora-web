-- CreateEnum
CREATE TYPE "AdEventType" AS ENUM ('impression', 'click');

-- CreateEnum
CREATE TYPE "AdObjective" AS ENUM ('AWARENESS', 'TRAFFIC', 'CONVERSIONS', 'VISITS');

-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('STARTER', 'HOST_PRO', 'CONSISTENT', 'TRENDING', 'LEGEND');

-- CreateEnum
CREATE TYPE "CelebrationStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CelebrationVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "CreativeType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "EmotionKind" AS ENUM ('joy', 'calm', 'focus', 'love', 'stress', 'anxious', 'bored', 'excited', 'confident', 'tired', 'neutral');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('JOIN', 'LEAVE', 'MUTE', 'UNMUTE', 'START_STREAM', 'STOP_STREAM', 'MESSAGE', 'SCREEN_START', 'SCREEN_STOP', 'RAISE_HAND', 'LOWER_HAND');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('CREDIT', 'DEBIT', 'AD_SPEND', 'RESERVE', 'RELEASE', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateEnum
CREATE TYPE "ModerationKind" AS ENUM ('TEXT', 'IMAGE');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PersonaAssetKind" AS ENUM ('AVATAR', 'REACTION');

-- CreateEnum
CREATE TYPE "PersonaEmotion" AS ENUM ('NEUTRAL', 'HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'DISGUSTED', 'FEARFUL', 'CALM', 'FOCUSED', 'TIRED', 'CONFIDENT');

-- CreateEnum
CREATE TYPE "PersonaReactionType" AS ENUM ('LIKE', 'LOVE', 'LAUGH', 'WOW', 'SAD', 'ANGRY', 'CLAP', 'FIRE', 'OK', 'THINKING', 'HEART', 'PARTY');

-- CreateEnum
CREATE TYPE "PulseTxn" AS ENUM ('EARN', 'SPEND', 'BURN', 'ADJUST', 'GRANT');

-- CreateEnum
CREATE TYPE "ReactionKind" AS ENUM ('MOOD', 'PARTY', 'STREAM');

-- CreateEnum
CREATE TYPE "RenderStatus" AS ENUM ('QUEUED', 'RUNNING', 'DONE', 'ERROR');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('ORGANIZER_FEE', 'ATTENDEE_PULSE', 'ATTENDEE_ZENCOIN', 'BONUS');

-- CreateEnum
CREATE TYPE "RoomRole" AS ENUM ('HOST', 'MODERATOR', 'PARTICIPANT');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'CLEAN', 'INFECTED');

-- CreateEnum
CREATE TYPE "ShowVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TOPUP', 'SPEND', 'REFUND');

-- CreateEnum
CREATE TYPE "VibeCategory" AS ENUM ('AWE', 'WARMTH', 'ENERGY', 'INSIGHT');

-- CreateEnum
CREATE TYPE "VibeRarity" AS ENUM ('CORE', 'SEASONAL', 'EARNED');

-- CreateEnum
CREATE TYPE "VideoGenStatus" AS ENUM ('queued', 'running', 'done', 'failed');

-- CreateTable
CREATE TABLE "AdCampaign" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,
    "title" TEXT NOT NULL,
    "objective" "AdObjective" NOT NULL,
    "status" "AdStatus" NOT NULL DEFAULT 'DRAFT',
    "creativeType" "CreativeType" NOT NULL,
    "creativeUrl" TEXT NOT NULL,
    "landingUrl" TEXT,
    "dailyBudgetCents" INTEGER NOT NULL,
    "totalBudgetCents" INTEGER NOT NULL,
    "radiusKm" INTEGER NOT NULL DEFAULT 50,
    "centerLat" DOUBLE PRECISION,
    "centerLon" DOUBLE PRECISION,
    "locationsJson" TEXT,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdConversion" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "creativeId" TEXT,
    "viewKey" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "rewardCents" INTEGER NOT NULL DEFAULT 0,
    "channel" TEXT,
    "shortSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdCreative" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL DEFAULT 'Learn More',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdCreative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdEvent" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "viewKey" TEXT,
    "userId" TEXT,
    "campaignId" TEXT,
    "ms" INTEGER,
    "mood" TEXT,
    "metaJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdMetricDaily" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "campaignId" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "hovers" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "spendCents" INTEGER NOT NULL DEFAULT 0,
    "rewardsCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdMetricDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCelebrationControls" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "config" JSONB,

    CONSTRAINT "AdminCelebrationControls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "roomId" TEXT,
    "path" TEXT,
    "meta" JSONB,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiLog" (
    "id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT,
    "status" INTEGER NOT NULL,
    "requestId" TEXT,
    "durationMs" INTEGER NOT NULL,
    "ownerId" TEXT,
    "publisher" TEXT,
    "ip" TEXT,
    "ua" TEXT,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aura" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "intensity" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

    CONSTRAINT "Aura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "addressText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dailyBudgetCents" INTEGER NOT NULL,
    "targetingRadiusMiles" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capsule" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'video',
    "mediaUrl" TEXT,
    "caption" TEXT,
    "emotion" TEXT,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Capsule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Celebration" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "CelebrationStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "CelebrationVisibility" NOT NULL DEFAULT 'PUBLIC',
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "themeKey" TEXT,
    "goalPulse" INTEGER DEFAULT 0,
    "budgetZencoin" INTEGER DEFAULT 0,
    "allowInvites" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Celebration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BadgeType" NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CelebrationBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationEIRollup5m" (
    "id" TEXT NOT NULL,
    "celebrationId" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "reactions" INTEGER NOT NULL DEFAULT 0,
    "eiScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "moodVec" JSONB,

    CONSTRAINT "CelebrationEIRollup5m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationInvite" (
    "id" TEXT NOT NULL,
    "celebrationId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviteeId" TEXT,
    "inviteeEmail" TEXT,
    "role" TEXT,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CelebrationInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationParticipant" (
    "id" TEXT NOT NULL,
    "celebrationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CelebrationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationReaction" (
    "id" TEXT NOT NULL,
    "celebrationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ReactionKind" NOT NULL,
    "emotion" TEXT,
    "intensity" DOUBLE PRECISION,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CelebrationReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationReward" (
    "id" TEXT NOT NULL,
    "celebrationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "RewardType" NOT NULL,
    "zencoin" INTEGER NOT NULL DEFAULT 0,
    "pulse" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT,
    "ledgerTxId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CelebrationReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationShow" (
    "id" TEXT NOT NULL,
    "celebrationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT,
    "hostId" TEXT,
    "hostName" TEXT,
    "hostAvatarUrl" TEXT,
    "visibility" "ShowVisibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CelebrationShow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationShowGuest" (
    "id" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" TEXT,

    CONSTRAINT "CelebrationShowGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebrationStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 0,
    "lastCelebrationAt" TIMESTAMP(3),

    CONSTRAINT "CelebrationStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelHit" (
    "id" TEXT NOT NULL,
    "shortLinkId" TEXT,
    "channel" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelHit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CineverseMovie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "resolution" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CineverseMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CineverseMovie__DISABLED" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CineverseMovie__DISABLED_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinTx" (
    "id" TEXT NOT NULL,
    "fromId" TEXT,
    "toId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinTx_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CpvView" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "costCents" INTEGER NOT NULL,
    "ledgerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CpvView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntent" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EchoTrack" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EchoTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EcoMetricDaily" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "campaignId" TEXT,
    "co2g" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "energyWh" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcoMetricDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconDaily" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "earnTotal" INTEGER NOT NULL DEFAULT 0,
    "spendTotal" INTEGER NOT NULL DEFAULT 0,
    "burnTotal" INTEGER NOT NULL DEFAULT 0,
    "reserve" INTEGER NOT NULL DEFAULT 0,
    "poolNext" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EconDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmmlAsset" (
    "id" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 2,
    "supply" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmmlAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmmlEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "source" TEXT,
    "type" TEXT NOT NULL,
    "emotion" TEXT,
    "intensity" DOUBLE PRECISION,
    "meta" JSONB,

    CONSTRAINT "EmmlEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmmlIndex" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmmlIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmmlMarket" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmmlMarket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmmlReading" (
    "id" TEXT NOT NULL,
    "indexId" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "meta" JSONB,

    CONSTRAINT "EmmlReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmmlTick" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION,

    CONSTRAINT "EmmlTick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionBaselineWeight" (
    "id" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionBaselineWeight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionDividend" (
    "id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,

    CONSTRAINT "EmotionDividend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionEvent" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "emotion" "EmotionKind",
    "intensity" DOUBLE PRECISION,
    "userId" TEXT,
    "source" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionIndexDaily" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "emotion" "EmotionKind" NOT NULL,
    "ei" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "avgIntensity" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "EmotionIndexDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionMarketTick" (
    "id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emotion" "EmotionKind",
    "ei" DOUBLE PRECISION NOT NULL,
    "globalEi" DOUBLE PRECISION,
    "zenMultiplier" DOUBLE PRECISION,

    CONSTRAINT "EmotionMarketTick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionMirror" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "intensity" DOUBLE PRECISION NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionMirror_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionStake" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emotion" "EmotionKind" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "windowEnd" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionStake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB,
    "actorId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudEvent" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "reason" TEXT,
    "ip" TEXT,
    "userId" TEXT,
    "viewKey" TEXT,
    "score" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalNowLiveTicker" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "liveCount" INTEGER NOT NULL DEFAULT 0,
    "topCelebrationId" TEXT,
    "eiIndex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalNowLiveTicker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpBlock" (
    "ip" TEXT NOT NULL,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IpBlock_pkey" PRIMARY KEY ("ip")
);

-- CreateTable
CREATE TABLE "KeyCounter" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeyCounter_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "original" TEXT,
    "size" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycRequest" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "fullName" TEXT,
    "dob" TEXT,
    "idType" TEXT,
    "idNumber" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "adminUser" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "refType" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "walletId" TEXT,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationItem" (
    "id" TEXT NOT NULL,
    "kind" "ModerationKind" NOT NULL,
    "text" TEXT,
    "objectKey" TEXT,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "flags" JSONB,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewer" TEXT,
    "fileKey" TEXT,
    "sha256" TEXT,
    "scanStatus" "ScanStatus",
    "scanAt" TIMESTAMP(3),

    CONSTRAINT "ModerationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_assets" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "reactionProfileId" TEXT,
    "kind" "PersonaAssetKind" NOT NULL,
    "emotion" "PersonaEmotion" NOT NULL DEFAULT 'NEUTRAL',
    "code" TEXT NOT NULL,
    "label" TEXT,
    "url" TEXT,
    "localPath" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "meta" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persona_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_profiles" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persona_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_reaction_mappings" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "reaction" "PersonaReactionType" NOT NULL,
    "emotion" "PersonaEmotion" NOT NULL DEFAULT 'NEUTRAL',
    "assetCode" TEXT NOT NULL,
    "intensity" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "meta" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persona_reaction_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_user_selections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "avatarCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persona_user_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaVoiceState" (
    "id" TEXT NOT NULL,
    "personaCode" TEXT NOT NULL,
    "isSpeaking" BOOLEAN NOT NULL DEFAULT false,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "emotionHint" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonaVoiceState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PulseLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PulseTxn" NOT NULL DEFAULT 'EARN',
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PulseLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PulseWallet" (
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "harmonyXp" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PulseWallet_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "ReflectionJournal" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "title" TEXT,
    "text" TEXT NOT NULL,
    "mood" TEXT,
    "tags" JSONB,
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReflectionJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RenderJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "RenderStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "input" JSONB,
    "outputUrl" TEXT,
    "error" TEXT,

    CONSTRAINT "RenderJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "role" "RoomRole" NOT NULL DEFAULT 'PARTICIPANT',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShadowEntry" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "emotion" TEXT,
    "privacy" TEXT NOT NULL DEFAULT 'private',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShadowEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShadowGarden" (
    "id" TEXT NOT NULL,
    "entries" JSONB NOT NULL,

    CONSTRAINT "ShadowGarden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShadowJournal" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShadowJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortLink" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "campaignId" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treasury" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "reserve" INTEGER NOT NULL DEFAULT 0,
    "poolLive" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Treasury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreeState" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreeState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorld" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "mood" TEXT NOT NULL DEFAULT 'neutral',
    "auraId" TEXT,
    "treeId" TEXT,
    "shadowId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWorld_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeTag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" "VibeCategory" NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 3,
    "rarity" "VibeRarity" NOT NULL DEFAULT 'CORE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VibeTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VibeTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "vibeId" TEXT NOT NULL,
    "category" "VibeCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchMs" INTEGER,
    "entropy" DOUBLE PRECISION,
    "isPassive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VibeTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "cfUid" TEXT NOT NULL,
    "playbackId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "durationSec" INTEGER,
    "sizeBytes" INTEGER,
    "creatorId" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoGenJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "prompt" TEXT NOT NULL,
    "status" "VideoGenStatus" NOT NULL DEFAULT 'queued',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "resultUrl" TEXT,
    "error" TEXT,

    CONSTRAINT "VideoGenJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletEntry" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletLedger" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "LedgerType" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "refType" TEXT,
    "refId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransfer" (
    "id" TEXT NOT NULL,
    "fromWalletId" TEXT NOT NULL,
    "toWalletId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZenBurn" (
    "id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "tickId" TEXT,

    CONSTRAINT "ZenBurn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZenLink" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "zenId" TEXT NOT NULL,
    "pulses" INTEGER NOT NULL DEFAULT 0,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "ZenLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZenOracle" (
    "id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "zenMultiplier" DOUBLE PRECISION NOT NULL,
    "note" TEXT,

    CONSTRAINT "ZenOracle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZenReissue" (
    "id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "tickId" TEXT,

    CONSTRAINT "ZenReissue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningEvent" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "kind" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarningEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudLog" (
    "id" TEXT NOT NULL,
    "kind" TEXT,
    "reason" TEXT,
    "ownerId" TEXT,
    "score" INTEGER,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudLog_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "KycSubmission" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedTier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "tier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "UserConsent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emotionProcessing" BOOLEAN NOT NULL DEFAULT false,
    "marketing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEngagement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xpBalance" INTEGER NOT NULL DEFAULT 0,
    "harmonyLevel" INTEGER NOT NULL DEFAULT 0,
    "squadScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdCampaign_ownerId_idx" ON "AdCampaign"("ownerId");

-- CreateIndex
CREATE INDEX "AdCampaign_status_idx" ON "AdCampaign"("status");

-- CreateIndex
CREATE INDEX "AdCampaign_objective_idx" ON "AdCampaign"("objective");

-- CreateIndex
CREATE INDEX "AdCampaign_createdAt_idx" ON "AdCampaign"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdConversion_viewKey_key" ON "AdConversion"("viewKey");

-- CreateIndex
CREATE INDEX "AdConversion_campaignId_eventType_idx" ON "AdConversion"("campaignId", "eventType");

-- CreateIndex
CREATE INDEX "AdCreative_campaignId_createdAt_idx" ON "AdCreative"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "AdEvent_action_createdAt_idx" ON "AdEvent"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AdEvent_viewKey_createdAt_idx" ON "AdEvent"("viewKey", "createdAt");

-- CreateIndex
CREATE INDEX "AdEvent_campaignId_createdAt_idx" ON "AdEvent"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "AdMetricDaily_day_idx" ON "AdMetricDaily"("day");

-- CreateIndex
CREATE INDEX "AdMetricDaily_campaignId_day_idx" ON "AdMetricDaily"("campaignId", "day");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_ts_type_idx" ON "AnalyticsEvent"("ts", "type");

-- CreateIndex
CREATE INDEX "ApiLog_ts_idx" ON "ApiLog"("ts");

-- CreateIndex
CREATE INDEX "ApiLog_requestId_idx" ON "ApiLog"("requestId");

-- CreateIndex
CREATE INDEX "ApiLog_path_ts_idx" ON "ApiLog"("path", "ts");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Celebration_slug_key" ON "Celebration"("slug");

-- CreateIndex
CREATE INDEX "Celebration_organizerId_status_idx" ON "Celebration"("organizerId", "status");

-- CreateIndex
CREATE INDEX "Celebration_status_startAt_idx" ON "Celebration"("status", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "CelebrationBadge_userId_type_key" ON "CelebrationBadge"("userId", "type");

-- CreateIndex
CREATE INDEX "CelebrationEIRollup5m_windowStart_idx" ON "CelebrationEIRollup5m"("windowStart");

-- CreateIndex
CREATE UNIQUE INDEX "CelebrationEIRollup5m_celebrationId_windowStart_key" ON "CelebrationEIRollup5m"("celebrationId", "windowStart");

-- CreateIndex
CREATE INDEX "CelebrationInvite_celebrationId_status_idx" ON "CelebrationInvite"("celebrationId", "status");

-- CreateIndex
CREATE INDEX "CelebrationParticipant_userId_joinedAt_idx" ON "CelebrationParticipant"("userId", "joinedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CelebrationParticipant_celebrationId_userId_key" ON "CelebrationParticipant"("celebrationId", "userId");

-- CreateIndex
CREATE INDEX "CelebrationReaction_celebrationId_createdAt_idx" ON "CelebrationReaction"("celebrationId", "createdAt");

-- CreateIndex
CREATE INDEX "CelebrationReaction_userId_createdAt_idx" ON "CelebrationReaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CelebrationReward_celebrationId_createdAt_idx" ON "CelebrationReward"("celebrationId", "createdAt");

-- CreateIndex
CREATE INDEX "CelebrationReward_userId_createdAt_idx" ON "CelebrationReward"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CelebrationShow_celebrationId_idx" ON "CelebrationShow"("celebrationId");

-- CreateIndex
CREATE INDEX "CelebrationShow_startAt_idx" ON "CelebrationShow"("startAt");

-- CreateIndex
CREATE INDEX "CelebrationShow_endAt_idx" ON "CelebrationShow"("endAt");

-- CreateIndex
CREATE UNIQUE INDEX "CelebrationStreak_userId_key" ON "CelebrationStreak"("userId");

-- CreateIndex
CREATE INDEX "ChannelHit_channel_createdAt_idx" ON "ChannelHit"("channel", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoinAccount_userId_key" ON "CoinAccount"("userId");

-- CreateIndex
CREATE INDEX "CoinAccount_createdAt_idx" ON "CoinAccount"("createdAt");

-- CreateIndex
CREATE INDEX "CoinTx_toId_createdAt_idx" ON "CoinTx"("toId", "createdAt");

-- CreateIndex
CREATE INDEX "CoinTx_fromId_createdAt_idx" ON "CoinTx"("fromId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CpvView_idempotencyKey_key" ON "CpvView"("idempotencyKey");

-- CreateIndex
CREATE INDEX "CpvView_campaignId_createdAt_idx" ON "CpvView"("campaignId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CreditTransaction_stripeSessionId_key" ON "CreditTransaction"("stripeSessionId");

-- CreateIndex
CREATE INDEX "CreditTransaction_accountId_idx" ON "CreditTransaction"("accountId");

-- CreateIndex
CREATE INDEX "EcoMetricDaily_day_idx" ON "EcoMetricDaily"("day");

-- CreateIndex
CREATE INDEX "EcoMetricDaily_campaignId_day_idx" ON "EcoMetricDaily"("campaignId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "EconDaily_day_key" ON "EconDaily"("day");

-- CreateIndex
CREATE UNIQUE INDEX "EmmlAsset_marketId_symbol_key" ON "EmmlAsset"("marketId", "symbol");

-- CreateIndex
CREATE INDEX "EmmlEvent_createdAt_idx" ON "EmmlEvent"("createdAt");

-- CreateIndex
CREATE INDEX "EmmlEvent_type_emotion_idx" ON "EmmlEvent"("type", "emotion");

-- CreateIndex
CREATE UNIQUE INDEX "EmmlIndex_slug_key" ON "EmmlIndex"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EmmlMarket_slug_key" ON "EmmlMarket"("slug");

-- CreateIndex
CREATE INDEX "EmmlReading_indexId_ts_idx" ON "EmmlReading"("indexId", "ts");

-- CreateIndex
CREATE INDEX "EmmlTick_assetId_ts_idx" ON "EmmlTick"("assetId", "ts");

-- CreateIndex
CREATE UNIQUE INDEX "EmotionBaselineWeight_emotion_key" ON "EmotionBaselineWeight"("emotion");

-- CreateIndex
CREATE INDEX "EmotionEvent_createdAt_idx" ON "EmotionEvent"("createdAt");

-- CreateIndex
CREATE INDEX "EmotionEvent_emotion_idx" ON "EmotionEvent"("emotion");

-- CreateIndex
CREATE INDEX "EmotionIndexDaily_emotion_day_idx" ON "EmotionIndexDaily"("emotion", "day");

-- CreateIndex
CREATE UNIQUE INDEX "EmotionIndexDaily_day_emotion_key" ON "EmotionIndexDaily"("day", "emotion");

-- CreateIndex
CREATE INDEX "EmotionMarketTick_ts_idx" ON "EmotionMarketTick"("ts");

-- CreateIndex
CREATE INDEX "EmotionStake_userId_status_idx" ON "EmotionStake"("userId", "status");

-- CreateIndex
CREATE INDEX "EmotionStake_emotion_windowStart_windowEnd_idx" ON "EmotionStake"("emotion", "windowStart", "windowEnd");

-- CreateIndex
CREATE INDEX "Event_roomId_timestamp_idx" ON "Event"("roomId", "timestamp");

-- CreateIndex
CREATE INDEX "FraudEvent_createdAt_idx" ON "FraudEvent"("createdAt");

-- CreateIndex
CREATE INDEX "FraudEvent_ip_createdAt_idx" ON "FraudEvent"("ip", "createdAt");

-- CreateIndex
CREATE INDEX "KeyCounter_updatedAt_idx" ON "KeyCounter"("updatedAt");

-- CreateIndex
CREATE INDEX "KycDocument_requestId_docType_idx" ON "KycDocument"("requestId", "docType");

-- CreateIndex
CREATE INDEX "KycRequest_ownerId_status_idx" ON "KycRequest"("ownerId", "status");

-- CreateIndex
CREATE INDEX "KycRequest_createdAt_idx" ON "KycRequest"("createdAt");

-- CreateIndex
CREATE INDEX "Ledger_toId_createdAt_idx" ON "Ledger"("toId", "createdAt");

-- CreateIndex
CREATE INDEX "Ledger_fromId_createdAt_idx" ON "Ledger"("fromId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_roomId_sentAt_idx" ON "Message"("roomId", "sentAt");

-- CreateIndex
CREATE INDEX "ModerationItem_status_createdAt_idx" ON "ModerationItem"("status", "createdAt");

-- CreateIndex
CREATE INDEX "persona_assets_profileId_kind_emotion_idx" ON "persona_assets"("profileId", "kind", "emotion");

-- CreateIndex
CREATE INDEX "persona_assets_kind_isActive_idx" ON "persona_assets"("kind", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "persona_assets_profileId_kind_code_key" ON "persona_assets"("profileId", "kind", "code");

-- CreateIndex
CREATE UNIQUE INDEX "persona_profiles_key_key" ON "persona_profiles"("key");

-- CreateIndex
CREATE INDEX "persona_profiles_isDefault_idx" ON "persona_profiles"("isDefault");

-- CreateIndex
CREATE INDEX "persona_reaction_mappings_profileId_reaction_idx" ON "persona_reaction_mappings"("profileId", "reaction");

-- CreateIndex
CREATE INDEX "persona_reaction_mappings_profileId_emotion_idx" ON "persona_reaction_mappings"("profileId", "emotion");

-- CreateIndex
CREATE UNIQUE INDEX "persona_reaction_mappings_profileId_reaction_emotion_key" ON "persona_reaction_mappings"("profileId", "reaction", "emotion");

-- CreateIndex
CREATE UNIQUE INDEX "persona_user_selections_userId_key" ON "persona_user_selections"("userId");

-- CreateIndex
CREATE INDEX "persona_user_selections_profileId_idx" ON "persona_user_selections"("profileId");

-- CreateIndex
CREATE INDEX "PersonaVoiceState_personaCode_idx" ON "PersonaVoiceState"("personaCode");

-- CreateIndex
CREATE INDEX "PulseLedger_userId_idx" ON "PulseLedger"("userId");

-- CreateIndex
CREATE INDEX "ReflectionJournal_worldId_createdAt_idx" ON "ReflectionJournal"("worldId", "createdAt");

-- CreateIndex
CREATE INDEX "RenderJob_createdAt_status_idx" ON "RenderJob"("createdAt", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RoomMember_userId_roomId_key" ON "RoomMember"("userId", "roomId");

-- CreateIndex
CREATE INDEX "ShadowEntry_journalId_createdAt_idx" ON "ShadowEntry"("journalId", "createdAt");

-- CreateIndex
CREATE INDEX "ShadowJournal_worldId_idx" ON "ShadowJournal"("worldId");

-- CreateIndex
CREATE INDEX "ShadowJournal_worldId_createdAt_idx" ON "ShadowJournal"("worldId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShortLink_slug_key" ON "ShortLink"("slug");

-- CreateIndex
CREATE INDEX "ShortLink_campaignId_createdAt_idx" ON "ShortLink"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "StripeEvent_createdAt_idx" ON "StripeEvent"("createdAt");

-- CreateIndex
CREATE INDEX "Transaction_walletId_createdAt_idx" ON "Transaction"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorld_userId_key" ON "UserWorld"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorld_auraId_key" ON "UserWorld"("auraId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorld_treeId_key" ON "UserWorld"("treeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorld_shadowId_key" ON "UserWorld"("shadowId");

-- CreateIndex
CREATE UNIQUE INDEX "VibeTag_slug_key" ON "VibeTag"("slug");

-- CreateIndex
CREATE INDEX "VibeTransaction_userId_createdAt_idx" ON "VibeTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "VibeTransaction_videoId_createdAt_idx" ON "VibeTransaction"("videoId", "createdAt");

-- CreateIndex
CREATE INDEX "VibeTransaction_vibeId_createdAt_idx" ON "VibeTransaction"("vibeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VibeTransaction_userId_videoId_vibeId_key" ON "VibeTransaction"("userId", "videoId", "vibeId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_cfUid_key" ON "Video"("cfUid");

-- CreateIndex
CREATE UNIQUE INDEX "Video_playbackId_key" ON "Video"("playbackId");

-- CreateIndex
CREATE INDEX "VideoGenJob_status_createdAt_idx" ON "VideoGenJob"("status", "createdAt");

-- CreateIndex
CREATE INDEX "VideoGenJob_userId_createdAt_idx" ON "VideoGenJob"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Wallet_ownerId_currency_idx" ON "Wallet"("ownerId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_ownerId_currency_key" ON "Wallet"("ownerId", "currency");

-- CreateIndex
CREATE INDEX "WalletLedger_walletId_createdAt_idx" ON "WalletLedger"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletLedger_type_idx" ON "WalletLedger"("type");

-- CreateIndex
CREATE UNIQUE INDEX "WalletLedger_refType_refId_key" ON "WalletLedger"("refType", "refId");

-- CreateIndex
CREATE INDEX "WalletTransfer_fromWalletId_createdAt_idx" ON "WalletTransfer"("fromWalletId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransfer_toWalletId_createdAt_idx" ON "WalletTransfer"("toWalletId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransfer_createdAt_idx" ON "WalletTransfer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ZenLink_worldId_key" ON "ZenLink"("worldId");

-- CreateIndex
CREATE INDEX "ConsentEvent_userId_createdAt_idx" ON "ConsentEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ConsentEvent_kind_createdAt_idx" ON "ConsentEvent"("kind", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "CreatorProfile"("userId");

-- CreateIndex
CREATE INDEX "DataRequest_userId_createdAt_idx" ON "DataRequest"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "DataRequest_status_createdAt_idx" ON "DataRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "EarningEvent_creatorId_createdAt_idx" ON "EarningEvent"("creatorId", "createdAt");

-- CreateIndex
CREATE INDEX "FraudLog_createdAt_idx" ON "FraudLog"("createdAt");

-- CreateIndex
CREATE INDEX "FraudLog_ownerId_createdAt_idx" ON "FraudLog"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "Interaction_videoId_createdAt_idx" ON "Interaction"("videoId", "createdAt");

-- CreateIndex
CREATE INDEX "Interaction_action_createdAt_idx" ON "Interaction"("action", "createdAt");

-- CreateIndex
CREATE INDEX "KycSubmission_ownerId_status_idx" ON "KycSubmission"("ownerId", "status");

-- CreateIndex
CREATE INDEX "KycSubmission_createdAt_idx" ON "KycSubmission"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_ownerId_key" ON "UserAccount"("ownerId");

-- CreateIndex
CREATE INDEX "UserAccount_status_idx" ON "UserAccount"("status");

-- CreateIndex
CREATE UNIQUE INDEX "StreamVideo_uid_key" ON "StreamVideo"("uid");

-- CreateIndex
CREATE INDEX "StreamVideo_ownerId_createdAt_idx" ON "StreamVideo"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "StreamVideo_status_createdAt_idx" ON "StreamVideo"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserConsent_userId_key" ON "UserConsent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEngagement_userId_key" ON "UserEngagement"("userId");

-- AddForeignKey
ALTER TABLE "AdCreative" ADD CONSTRAINT "AdCreative_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Capsule" ADD CONSTRAINT "Capsule_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Celebration" ADD CONSTRAINT "Celebration_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationBadge" ADD CONSTRAINT "CelebrationBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationEIRollup5m" ADD CONSTRAINT "CelebrationEIRollup5m_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationInvite" ADD CONSTRAINT "CelebrationInvite_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationInvite" ADD CONSTRAINT "CelebrationInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationInvite" ADD CONSTRAINT "CelebrationInvite_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationParticipant" ADD CONSTRAINT "CelebrationParticipant_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationParticipant" ADD CONSTRAINT "CelebrationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationReaction" ADD CONSTRAINT "CelebrationReaction_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationReaction" ADD CONSTRAINT "CelebrationReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationReward" ADD CONSTRAINT "CelebrationReward_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationReward" ADD CONSTRAINT "CelebrationReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationShow" ADD CONSTRAINT "CelebrationShow_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationShowGuest" ADD CONSTRAINT "CelebrationShowGuest_showId_fkey" FOREIGN KEY ("showId") REFERENCES "CelebrationShow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CelebrationStreak" ADD CONSTRAINT "CelebrationStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelHit" ADD CONSTRAINT "ChannelHit_shortLinkId_fkey" FOREIGN KEY ("shortLinkId") REFERENCES "ShortLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTx" ADD CONSTRAINT "CoinTx_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "CoinAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTx" ADD CONSTRAINT "CoinTx_toId_fkey" FOREIGN KEY ("toId") REFERENCES "CoinAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CpvView" ADD CONSTRAINT "CpvView_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmmlAsset" ADD CONSTRAINT "EmmlAsset_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "EmmlMarket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmmlReading" ADD CONSTRAINT "EmmlReading_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "EmmlIndex"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmmlTick" ADD CONSTRAINT "EmmlTick_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "EmmlAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmotionMirror" ADD CONSTRAINT "EmotionMirror_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "KycRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_assets" ADD CONSTRAINT "persona_assets_avatar_profile_fkey" FOREIGN KEY ("profileId") REFERENCES "persona_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_assets" ADD CONSTRAINT "persona_assets_reaction_profile_fkey" FOREIGN KEY ("reactionProfileId") REFERENCES "persona_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_reaction_mappings" ADD CONSTRAINT "persona_reaction_mappings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "persona_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_user_selections" ADD CONSTRAINT "persona_user_selections_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "persona_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReflectionJournal" ADD CONSTRAINT "ReflectionJournal_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShadowEntry" ADD CONSTRAINT "ShadowEntry_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "ShadowJournal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShadowJournal" ADD CONSTRAINT "ShadowJournal_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorld" ADD CONSTRAINT "UserWorld_auraId_fkey" FOREIGN KEY ("auraId") REFERENCES "Aura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorld" ADD CONSTRAINT "UserWorld_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "TreeState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorld" ADD CONSTRAINT "UserWorld_shadowId_fkey" FOREIGN KEY ("shadowId") REFERENCES "ShadowGarden"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VibeTransaction" ADD CONSTRAINT "VibeTransaction_vibeId_fkey" FOREIGN KEY ("vibeId") REFERENCES "VibeTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VibeTransaction" ADD CONSTRAINT "VibeTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletLedger" ADD CONSTRAINT "WalletLedger_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransfer" ADD CONSTRAINT "WalletTransfer_fromWalletId_fkey" FOREIGN KEY ("fromWalletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransfer" ADD CONSTRAINT "WalletTransfer_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZenLink" ADD CONSTRAINT "ZenLink_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "UserWorld"("id") ON DELETE CASCADE ON UPDATE CASCADE;
