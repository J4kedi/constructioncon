import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const documentoExistente = await prisma.documento.findUnique({ where: { id: parseInt(id) } });

    if (!documentoExistente) {
      console.error("[v1] Documento não encontrado:", id);
      return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
    }

    await prisma.documento.delete({ where: { id: parseInt(id) } });
    console.log("[v1] Documento deletado:", id);

    return NextResponse.json({ message: "Documento deletado com sucesso" });
  } catch (error) {
    console.error("[v1] Erro ao deletar documento:", error);
    return NextResponse.json({ error: "Erro ao deletar documento" }, { status: 500 });
  }
}
