import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tipo, dataEmissao, autor, conteudo, anexos } = body;

    const documentoExistente = await prisma.documento.findUnique({ where: { id } });

    if (!documentoExistente) {
      console.error("[v1] Documento não encontrado:", id);
      return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
    }

    const atualizado = await prisma.documento.update({
      where: { id },
      data: {
        tipo,
        autor,
        conteudo,
        dataEmissao: new Date(dataEmissao),
        anexos: anexos || [],
      },
    });

    console.log("[v1] Documento atualizado:", id);
    return NextResponse.json(atualizado);
  } catch (error) {
    console.error("[v1] Erro ao atualizar documento:", error);
    return NextResponse.json({ error: "Erro ao atualizar documento" }, { status: 500 });
  }
}
