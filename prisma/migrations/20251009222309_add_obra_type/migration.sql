-- CreateEnum
CREATE TYPE "public"."ObraType" AS ENUM ('RESIDENCIAL', 'COMERCIAL');

-- AlterTable
ALTER TABLE "public"."Obra" ADD COLUMN     "type" "public"."ObraType" NOT NULL DEFAULT 'RESIDENCIAL';
