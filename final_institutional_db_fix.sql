-- 1. Corrected Table: InstiRegister (with trainerId)
-- Run this if the table doesn't exist yet, or check columns below
CREATE TABLE IF NOT EXISTS "InstiRegister" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "instiName" TEXT NOT NULL,
    "instiType" TEXT NOT NULL,
    "headName" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "trainerId" TEXT, -- Added for trainer assignment
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstiRegister_pkey" PRIMARY KEY ("id")
);

-- Ensure Unique Index for InstiRegister
CREATE UNIQUE INDEX IF NOT EXISTS "InstiRegister_uniqueId_key" ON "InstiRegister"("uniqueId");

-- 2. Add Missing Columns to existing tables (Safe to run if columns exist in some environments but not others)

-- Add trainerId to InstiRegister if it's missing
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='InstiRegister' AND column_name='trainerId') THEN
        ALTER TABLE "InstiRegister" ADD COLUMN "trainerId" TEXT;
    END IF;
END $$;

-- Add instiId to StudentAdmission
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='StudentAdmission' AND column_name='instiId') THEN
        ALTER TABLE "StudentAdmission" ADD COLUMN "instiId" TEXT;
    END IF;
END $$;
