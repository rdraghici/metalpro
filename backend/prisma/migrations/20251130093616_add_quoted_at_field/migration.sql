-- Add quotedAt timestamp field to rfqs table
ALTER TABLE "rfqs" ADD COLUMN IF NOT EXISTS "quotedAt" TIMESTAMP(3);