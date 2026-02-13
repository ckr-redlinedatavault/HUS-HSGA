-- SQL to update StudentAdmission table to store School Data Entry fields
-- This effectively repurposes the table (or extends it) to hold the requested headers.

BEGIN;

-- Add new columns to match the requested form fields
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "udise" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "management" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "mandal" TEXT;
-- 'district' already exists
-- 'schoolName' already exists
-- 'address' already exists

ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "chairmanName" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "chairmanMobile" TEXT; -- Mobile number
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "headName" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "headPhone" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "altPhone" TEXT;      -- Alternative number
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "principalEmail" TEXT; -- Principal mail id
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "instiEmail" TEXT;     -- Email
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "coordinatorName" TEXT; -- Coordinator
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "coordinatorMobile" TEXT; -- Mobile number 2

-- MoU Fields
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "mouStatus" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "mouStart" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "mouEnd" TEXT;

-- Statistics
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "enrollmentEstimate" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "staffCount" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "studentCount" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "totalClasses" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "feesCollected" TEXT;
ALTER TABLE "StudentAdmission" ADD COLUMN IF NOT EXISTS "recentUpdates" TEXT;

COMMIT;
