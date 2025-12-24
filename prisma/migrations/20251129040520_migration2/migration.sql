/*
  Warnings:

  - A unique constraint covering the columns `[legacyId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "legacyId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_legacyId_key" ON "Customer"("legacyId");
