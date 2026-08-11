CREATE TABLE "emml_snapshot" (
    "id" TEXT NOT NULL,
    "health" TEXT NOT NULL,
    "heatSampleSize" INTEGER NOT NULL,
    "indicesTracked" INTEGER NOT NULL,
    "marketsOnline" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "composite" JSONB DEFAULT '{}'::jsonb,
    "indicesJson" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "marketsJson" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "metaJson" JSONB NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT "emml_snapshot_pkey" PRIMARY KEY ("id")
);
