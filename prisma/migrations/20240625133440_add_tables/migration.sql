/*
  Warnings:

  - Added the required column `createdById` to the `Drug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drug" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MedicalRecord" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drug" ADD CONSTRAINT "Drug_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
