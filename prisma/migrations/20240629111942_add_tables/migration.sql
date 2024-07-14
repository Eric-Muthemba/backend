-- DropIndex
DROP INDEX "Payment_checkout_id_key";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "checkout_id" SET DEFAULT '-';
