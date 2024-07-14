/*
  Warnings:

  - You are about to drop the column `date` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `prescriptionId` on the `Payment` table. All the data in the column will be lost.
  - The `method` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `reference` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethods" AS ENUM ('MPESA', 'CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_prescriptionId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "date",
DROP COLUMN "prescriptionId",
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "method",
ADD COLUMN     "method" "PaymentMethods" NOT NULL DEFAULT 'MPESA';

-- CreateTable
CREATE TABLE "PrescriptionPayments" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "PrescriptionPayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrescriptionPayments" ADD CONSTRAINT "PrescriptionPayments_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionPayments" ADD CONSTRAINT "PrescriptionPayments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
