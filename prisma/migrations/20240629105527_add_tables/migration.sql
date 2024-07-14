-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "checkout_id" TEXT NOT NULL DEFAULT '-',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '-';
