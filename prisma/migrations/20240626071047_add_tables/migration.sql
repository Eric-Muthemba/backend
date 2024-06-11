/*
  Warnings:

  - You are about to drop the `_PrescriptionDrugs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Drug` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PrescriptionDrugs" DROP CONSTRAINT "_PrescriptionDrugs_A_fkey";

-- DropForeignKey
ALTER TABLE "_PrescriptionDrugs" DROP CONSTRAINT "_PrescriptionDrugs_B_fkey";

-- AlterTable
ALTER TABLE "Drug" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "_PrescriptionDrugs";

-- CreateTable
CREATE TABLE "PrescriptionDrug" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "PrescriptionDrug_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrescriptionDrug" ADD CONSTRAINT "PrescriptionDrug_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDrug" ADD CONSTRAINT "PrescriptionDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
