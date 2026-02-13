-- CreateTable Institutional Registration
CREATE TABLE "InstiRegister" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstiRegister_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstiRegister_uniqueId_key" ON "InstiRegister"("uniqueId");
