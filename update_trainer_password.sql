-- Add password column to existing TraiRegister table
ALTER TABLE "TraiRegister" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'temporary_password';

-- After running this, شما can remove the default value if you want
-- ALTER TABLE "TrainerRegistration" ALTER COLUMN "password" DROP DEFAULT;
