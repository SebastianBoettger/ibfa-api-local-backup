/*
  Warnings:

  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `extra` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `legalName` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `taxNumber` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "email",
DROP COLUMN "extra",
DROP COLUMN "legalName",
DROP COLUMN "name",
DROP COLUMN "notes",
DROP COLUMN "phone",
DROP COLUMN "taxNumber",
ADD COLUMN     "altLastName" TEXT,
ADD COLUMN     "altTitle" TEXT,
ADD COLUMN     "appointmentNote" TEXT,
ADD COLUMN     "appointmentTime1" TEXT,
ADD COLUMN     "appointmentTime2" TEXT,
ADD COLUMN     "appointmentsInfo" TEXT,
ADD COLUMN     "contact1Name" TEXT,
ADD COLUMN     "contact1SecretNumber" TEXT,
ADD COLUMN     "contact2Name" TEXT,
ADD COLUMN     "contact2Phone" TEXT,
ADD COLUMN     "email2" TEXT,
ADD COLUMN     "email3" TEXT,
ADD COLUMN     "estimatedInspectionDuration" TEXT,
ADD COLUMN     "fachbezeichnung" TEXT,
ADD COLUMN     "fax" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "generalEmail" TEXT,
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "inspectionInterval" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "mobileGeneral" TEXT,
ADD COLUMN     "neverWeekdayForAppointments" TEXT,
ADD COLUMN     "note1" TEXT,
ADD COLUMN     "note2" TEXT,
ADD COLUMN     "phone2" TEXT,
ADD COLUMN     "phoneGeneral" TEXT,
ADD COLUMN     "preferredWeekdayForAppointments" TEXT,
ADD COLUMN     "salutation" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "statusReason" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "uniqueName" TEXT;
