import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const documentos = await prisma.documento.findMany();
    console.log("[v1] Documentos encontrados:", documentos.length);
    return NextResponse.json(documentos);
  } catch (error) {
    console.error("[v1] Erro ao listar documentos:", error);
    return NextResponse.json({ error: "Erro ao listar documentos" }, { status: 500 });
  }
}
