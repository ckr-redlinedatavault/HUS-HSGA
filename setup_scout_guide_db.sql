-- Create the ScoutGuideEnrollment table
CREATE TABLE IF NOT EXISTS "ScoutGuideEnrollment" (
    "id" TEXT NOT NULL,
    "formNo" TEXT,
    "date" TEXT NOT NULL,
    "photo" TEXT NOT NULL,

    "fullName" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "aadharNo" TEXT NOT NULL,
    "sectionApplied" TEXT NOT NULL,

    "schoolName" TEXT NOT NULL,
    "schoolAddress" TEXT NOT NULL,
    "udiseCode" TEXT,
    "classStudying" TEXT NOT NULL,
    "section" TEXT,
    "academicYear" TEXT NOT NULL,

    "fatherName" TEXT NOT NULL,
    "fatherOccupation" TEXT,
    "fatherMobile" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "motherOccupation" TEXT,
    "motherMobile" TEXT,
    "guardianName" TEXT,
    "guardianOccupation" TEXT,
    "guardianMobile" TEXT,

    "residentialAddress" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "mandal" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,

    "generalHealth" TEXT NOT NULL,
    "allergies" TEXT,
    "chronicIllness" TEXT,
    "vaccinationStatus" TEXT NOT NULL,
    "specialNeeds" TEXT,

    "emergencyContactName" TEXT NOT NULL,
    "emergencyRelationship" TEXT NOT NULL,
    "emergencyMobile" TEXT NOT NULL,

    "parentName" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "parentSignature" TEXT NOT NULL,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoutGuideEnrollment_pkey" PRIMARY KEY ("id")
);
