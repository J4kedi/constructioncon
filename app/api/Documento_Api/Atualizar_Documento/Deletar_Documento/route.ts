import { type NextRequest, NextResponse } from "next/server";
import { documentos } from "@/app/lib/documentos-store";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 })
    }

    const index = documentos.findIndex((doc) => doc.id === id)

    if (index === -1) {
      console.error("[v0] Documento não encontrado:", id)
      return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 })
    }

    documentos.splice(index, 1)
    console.log("[v0] Documento deletado. Total restante:", documentos.length)

    return NextResponse.json({ message: "Documento deletado com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao deletar documento:", error)
    return NextResponse.json({ error: "Erro ao deletar documento" }, { status: 500 })
  }
}
