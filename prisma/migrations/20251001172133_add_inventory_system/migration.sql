/*
  Warnings:

  - You are about to drop the `Estoque` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TipoMovimento" AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE');

-- DropForeignKey
ALTER TABLE "public"."Estoque" DROP CONSTRAINT "Estoque_obraId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Estoque" DROP CONSTRAINT "Estoque_supplierId_fkey";

-- DropTable
DROP TABLE "public"."Estoque";

-- CreateTable
CREATE TABLE "public"."CatalogoItem" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "unidade" "public"."UnidadeMedida" NOT NULL,
    "categoria" TEXT,
    "nivelMinimo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CatalogoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EstoqueMovimento" (
    "id" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "tipo" "public"."TipoMovimento" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catalogoItemId" TEXT NOT NULL,
    "obraDestinoId" TEXT,
    "usuarioId" TEXT,

    CONSTRAINT "EstoqueMovimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CatalogoItem_companyId_nome_key" ON "public"."CatalogoItem"("companyId", "nome");

-- AddForeignKey
ALTER TABLE "public"."CatalogoItem" ADD CONSTRAINT "CatalogoItem_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EstoqueMovimento" ADD CONSTRAINT "EstoqueMovimento_catalogoItemId_fkey" FOREIGN KEY ("catalogoItemId") REFERENCES "public"."CatalogoItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EstoqueMovimento" ADD CONSTRAINT "EstoqueMovimento_obraDestinoId_fkey" FOREIGN KEY ("obraDestinoId") REFERENCES "public"."Obra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EstoqueMovimento" ADD CONSTRAINT "EstoqueMovimento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
