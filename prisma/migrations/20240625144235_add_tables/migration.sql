/*
  Warnings:

  - The primary key for the `Drug` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MedicalRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Patient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Prescription` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_medicalRecordId_fkey";

-- DropForeignKey
ALTER TABLE "_PrescriptionDrugs" DROP CONSTRAINT "_PrescriptionDrugs_A_fkey";

-- DropForeignKey
ALTER TABLE "_PrescriptionDrugs" DROP CONSTRAINT "_PrescriptionDrugs_B_fkey";

-- AlterTable
ALTER TABLE "Drug" DROP CONSTRAINT "Drug_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Drug_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Drug_id_seq";

-- AlterTable
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "patientId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MedicalRecord_id_seq";

-- AlterTable
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Patient_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Patient_id_seq";

-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "prescriptionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Payment_id_seq";

-- AlterTable
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "medicalRecordId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Prescription_id_seq";

-- AlterTable
ALTER TABLE "_PrescriptionDrugs" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrescriptionDrugs" ADD CONSTRAINT "_PrescriptionDrugs_A_fkey" FOREIGN KEY ("A") REFERENCES "Drug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrescriptionDrugs" ADD CONSTRAINT "_PrescriptionDrugs_B_fkey" FOREIGN KEY ("B") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
