-- AlterTable
ALTER TABLE "public"."Feature" ADD COLUMN     "parentId" TEXT;

-- CreateTable
CREATE TABLE "public"."Atividade_Cronograma" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "duracaoDias" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Atividade_Cronograma_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Feature" ADD CONSTRAINT "Feature_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
