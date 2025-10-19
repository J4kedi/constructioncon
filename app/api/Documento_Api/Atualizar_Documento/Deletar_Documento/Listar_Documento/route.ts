import { NextResponse } from "next/server";
import { documentos } from "@/app/lib/documentos-store";

export async function GET() {
  console.log("[v0] Api Listar_Documento chamada")
  console.log("[v0] Número de documentos no store:", documentos.length)
  console.log("[v0] Documentos:", JSON.stringify(documentos, null, 2))

  try {
    return NextResponse.json(documentos)
  } catch (error) {
    console.error("[v0] Erro ao retornar documentos:", error)
    return NextResponse.json({ error: "Erro ao listar documentos" }, { status: 500 })
  }
}
