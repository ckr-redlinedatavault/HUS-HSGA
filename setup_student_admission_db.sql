-- Create StudentAdmission table manually because prisma db push is hanging
CREATE TABLE "StudentAdmission" (
    "id" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "aadharNo" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "studentSignature" TEXT NOT NULL,
    "principalSignature" TEXT NOT NULL,
    "seal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAdmission_pkey" PRIMARY KEY ("id")
);
