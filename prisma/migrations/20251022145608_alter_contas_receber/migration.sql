-- AlterTable
ALTER TABLE "ContaReceber" ADD COLUMN     "anexoUrl" TEXT;

-- CreateTable
CREATE TABLE "Documento" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "anexos" TEXT[],
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);
