import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const novo = await prisma.documento.create({
      data: {
        tipo: body.tipo,
        autor: body.autor,
        conteudo: body.conteudo,
        dataEmissao: new Date(body.dataEmissao),
        anexos: body.anexos || [],
      },
    });

    return NextResponse.json(novo, { status: 201 });
  } catch (error) {
    console.error("[v1] Erro ao salvar documento:", error);
    return NextResponse.json({ error: "Erro interno ao salvar documento" }, { status: 500 });
  }
}
