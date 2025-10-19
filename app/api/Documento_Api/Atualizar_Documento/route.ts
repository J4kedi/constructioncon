import { type NextRequest, NextResponse } from "next/server";
import { documentos } from "@/app/lib/documentos-store";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, tipo, dataEmissao, autor, conteudo, anexos } = body

    const index = documentos.findIndex((doc) => doc.id === id)

    if (index === -1) {
      console.error("[v0] Documento não encontrado:", id)
      return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 })
    }

    documentos[index] = {
      ...documentos[index],
      tipo,
      titulo_documento: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - ${autor}`,
      data_emissão: dataEmissao,
      autor,
      conteudo,
      anexos: anexos?.map((name: string) => ({ name, size: 0 })) || [],
    }

    console.log("[v0] Documento atualizado:", id)
    return NextResponse.json(documentos[index])
  } catch (error) {
    console.error("[v0] Erro ao atualizar documento:", error)
    return NextResponse.json({ error: "Erro ao atualizar documento" }, { status: 500 })
  }
}
