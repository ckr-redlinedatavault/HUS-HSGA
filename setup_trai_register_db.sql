-- Create the TraiRegister table from scratch
CREATE TABLE "TraiRegister" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TraiRegister_pkey" PRIMARY KEY ("id")
);

-- Create a unique index on the uniqueId column
CREATE UNIQUE INDEX "TraiRegister_uniqueId_key" ON "TraiRegister"("uniqueId");
