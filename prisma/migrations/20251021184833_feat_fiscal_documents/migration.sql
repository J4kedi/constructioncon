-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentType" ADD VALUE 'NOTA_FISCAL_SERVICO';
ALTER TYPE "DocumentType" ADD VALUE 'NOTA_FISCAL_PRODUTO';
ALTER TYPE "DocumentType" ADD VALUE 'BOLETO';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "contaPagarId" TEXT,
ADD COLUMN     "contaReceberId" TEXT;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_contaPagarId_fkey" FOREIGN KEY ("contaPagarId") REFERENCES "ContaPagar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_contaReceberId_fkey" FOREIGN KEY ("contaReceberId") REFERENCES "ContaReceber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
