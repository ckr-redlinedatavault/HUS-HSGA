-- SQL to update InstiRegister table to match requested headers
-- Header Mapping:
-- School ID           -> uniqueId (Already exists)
-- School Name         -> instiName (Already exists)
-- UDISE               -> udise
-- Management          -> management
-- District            -> district (Already exists)
-- Mandal              -> mandal
-- Address             -> address
-- Chairman Name       -> chairmanName
-- Mobile number       -> chairmanMobile
-- Head Name           -> headName (Already exists)
-- Head Phone          -> headPhone
-- Alternative number  -> altPhone
-- Principal mail id   -> principalEmail
-- Email               -> email (Already exists)
-- Coordinator         -> coordinatorName
-- Mobile number 2     -> coordinatorMobile
-- MoUStatus           -> mouStatus
-- MoUStart            -> mouStart
-- MoUEnd              -> mouEnd
-- Enrollment Estimate -> enrollmentEstimate
-- Notes               -> notes
-- Staff Count         -> staffCount
-- Student Count       -> studentCount
-- Total Classes       -> totalClasses
-- Fees Collected      -> feesCollected
-- Recent Updates      -> recentUpdates

BEGIN;

ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "udise" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "management" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "mandal" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "chairmanName" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "chairmanMobile" TEXT; -- Mobile number
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "headPhone" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "altPhone" TEXT;      -- Alternative number
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "principalEmail" TEXT; -- Principal mail id
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "coordinatorName" TEXT; -- Coordinator
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "coordinatorMobile" TEXT; -- Mobile number 2

-- MoU Fields
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "mouStatus" TEXT DEFAULT 'PENDING';
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "mouStart" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "mouEnd" TEXT;

-- Statistics
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "enrollmentEstimate" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "staffCount" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "studentCount" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "totalClasses" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "feesCollected" TEXT;
ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "recentUpdates" TEXT;

ALTER TABLE "InstiRegister" ADD COLUMN IF NOT EXISTS "isProfileComplete" BOOLEAN NOT NULL DEFAULT false;

COMMIT;
