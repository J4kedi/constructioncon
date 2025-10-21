/*
  Warnings:

  - You are about to drop the `Despesa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Receita` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."StatusContaPagar" AS ENUM ('A_PAGAR', 'PAGO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "public"."StatusContaReceber" AS ENUM ('A_RECEBER', 'RECEBIDO', 'VENCIDO');

-- DropForeignKey
ALTER TABLE "public"."Despesa" DROP CONSTRAINT "Despesa_approverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Despesa" DROP CONSTRAINT "Despesa_obraId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Despesa" DROP CONSTRAINT "Despesa_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Receita" DROP CONSTRAINT "Receita_obraId_fkey";

-- DropTable
DROP TABLE "public"."Despesa";

-- DropTable
DROP TABLE "public"."Receita";

-- CreateTable
CREATE TABLE "public"."ContaPagar" (
    "id" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "categoria" "public"."CategoriaDespesa" NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "anexoUrl" TEXT,
    "status" "public"."StatusContaPagar" NOT NULL DEFAULT 'A_PAGAR',
    "obraId" TEXT,
    "approverId" TEXT,
    "supplierId" TEXT,

    CONSTRAINT "ContaPagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContaReceber" (
    "id" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "status" "public"."StatusContaReceber" NOT NULL DEFAULT 'A_RECEBER',
    "obraId" TEXT NOT NULL,

    CONSTRAINT "ContaReceber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ContaPagar" ADD CONSTRAINT "ContaPagar_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "public"."Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContaPagar" ADD CONSTRAINT "ContaPagar_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContaPagar" ADD CONSTRAINT "ContaPagar_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContaReceber" ADD CONSTRAINT "ContaReceber_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "public"."Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
