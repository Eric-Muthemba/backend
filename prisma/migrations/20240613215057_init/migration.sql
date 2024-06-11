-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DOCTOR', 'ADMIN', 'NURSE', 'CASHIER', 'PHARMACIST', 'LABTECH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY['PHARMACIST']::"Role"[],
    "refreshToken" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
