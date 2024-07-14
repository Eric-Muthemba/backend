/*
  Warnings:

  - A unique constraint covering the columns `[checkout_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "checkout_id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_checkout_id_key" ON "Payment"("checkout_id");
