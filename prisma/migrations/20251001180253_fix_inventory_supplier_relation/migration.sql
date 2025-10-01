-- AlterTable
ALTER TABLE "public"."EstoqueMovimento" ADD COLUMN     "supplierId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."EstoqueMovimento" ADD CONSTRAINT "EstoqueMovimento_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
