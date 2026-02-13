-- Create the CollegeAdmission table
CREATE TABLE IF NOT EXISTS "CollegeAdmission" (
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

    CONSTRAINT "CollegeAdmission_pkey" PRIMARY KEY ("id")
);
