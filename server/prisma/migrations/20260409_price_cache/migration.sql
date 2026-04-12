-- CreateTable
CREATE TABLE "price_cache" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "price_cache_cacheKey_key" ON "price_cache"("cacheKey");

-- CreateIndex
CREATE INDEX "price_cache_cacheKey_expiresAt_idx" ON "price_cache"("cacheKey", "expiresAt");
