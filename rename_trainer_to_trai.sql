-- Rename the existing TrainerRegistration table to TraiRegister
ALTER TABLE "TrainerRegistration" RENAME TO "TraiRegister";

-- Rename the unique index
ALTER INDEX "TrainerRegistration_uniqueId_key" RENAME TO "TraiRegister_uniqueId_key";

-- Rename the primary key constraint
ALTER TABLE "TraiRegister" RENAME CONSTRAINT "TrainerRegistration_pkey" TO "TraiRegister_pkey";
