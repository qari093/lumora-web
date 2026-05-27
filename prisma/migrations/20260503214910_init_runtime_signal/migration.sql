/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminCelebrationControls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Aura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Capsule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Celebration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationBadge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationEIRollup5m` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationInvite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationReaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationReward` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationShow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationShowGuest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CelebrationStreak` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CineverseMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreditTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EchoTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmmlAsset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmmlEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmmlIndex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmmlMarket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmmlReading` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmmlTick` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionBaselineWeight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionDividend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionIndexDaily` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionMarketTick` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionMirror` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmotionStake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GlobalNowLiveTicker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonaVoiceState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReflectionJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShadowEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShadowGarden` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShadowJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StripeCheckoutSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TreeState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserWorld` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VibeTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VibeTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoGenJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZenBurn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZenLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZenOracle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZenReissue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emml_snapshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `persona_assets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `persona_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `persona_reaction_mappings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `persona_user_selections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Account";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AdminCelebrationControls";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Aura";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Capsule";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Celebration";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationBadge";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationEIRollup5m";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationInvite";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationParticipant";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationReaction";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationReward";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationShow";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationShowGuest";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CelebrationStreak";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CineverseMovie";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CreditTransaction";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EchoTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmmlAsset";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmmlEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmmlIndex";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmmlMarket";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmmlReading";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmmlTick";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmotionBaselineWeight";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmotionDividend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmotionEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmotionIndexDaily";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmotionMarketTick";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmotionMirror";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmotionStake";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GlobalNowLiveTicker";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PersonaVoiceState";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ReflectionJournal";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ShadowEntry";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ShadowGarden";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ShadowJournal";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StripeCheckoutSession";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TreeState";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserWorld";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VibeTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VibeTransaction";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VideoGenJob";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Wallet";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WalletLedger";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZenBurn";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZenLink";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZenOracle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZenReissue";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "emml_snapshot";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "persona_assets";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "persona_profiles";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "persona_reaction_mappings";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "persona_user_selections";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "RuntimeSignal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "timestampMs" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
