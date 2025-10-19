"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Documento, Tipos_Documentos } from "@/app/lib/documento";
import { Button } from "@/app/ui/components/Button";

const tiposPermitidos: Tipos_Documentos[] = ["contrato", "orçamento", "certidão", "relatórios"]
const extensoesPermitidas = ["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg"]

export default function DocumentosDashboard() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [tipo, setTipo] = useState<Tipos_Documentos>("contrato")
  const [conteudo, setConteudo] = useState("")
  const [autor, setAutor] = useState("")
  const [dataEmissao, setDataEmissao] = useState("")
  const [anexos, setAnexos] = useState<FileList | null>(null)
  const [erroAnexo, setErroAnexo] = useState<string | null>(null)
  const [editandoId, setEditandoId] = useState<string | null>(null)

  const handleAnexosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = e.target.files
    if (!arquivos) return

    const arquivosValidos: File[] = []
    let erroDetectado = false

    Array.from(arquivos).forEach((file) => {
      const extensao = file.name.split(".").pop()?.toLowerCase()
      if (extensao && extensoesPermitidas.includes(extensao)) {
        arquivosValidos.push(file)
      } else {
        erroDetectado = true
      }
    })

    if (erroDetectado) {
      setErroAnexo("Só são aceitos arquivos PDF, Word, Excel ou imagens (PNG, JPG).")
      setAnexos(null)
    } else {
      setErroAnexo(null)
      const dt = new DataTransfer()
      arquivosValidos.forEach((file) => dt.items.add(file))
      setAnexos(dt.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tiposPermitidos.includes(tipo)) {
      alert("Tipo de documento inválido. Escolha entre contrato, orçamento, certidão ou relatórios.")
      return
    }

    const dataCorrigida = new Date(`${dataEmissao}T00:00:00`)

    try {
      if (editandoId) {
        const res = await fetch("app/api/Documento_Api/Atualizar_Documento", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editandoId,
            tipo,
            dataEmissao: dataCorrigida,
            autor,
            conteudo,
            anexos: anexos ? Array.from(anexos).map((file) => file.name) : [],
          }),
        })

        if (res.ok) {
          const docAtualizado = await res.json()
          setDocumentos((prev) => prev.map((doc) => (doc.id === editandoId ? docAtualizado : doc)))
          setEditandoId(null)
        } else {
          alert("Erro ao atualizar documento.")
          return
        }
      } else {
        const res = await fetch("app/api/Documento_Api/Atualizar_Documento/Deletar_Documento/Listar_Documento/Salvar_Documento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo,
            dataEmissao: dataCorrigida,
            autor,
            conteudo,
            anexos: anexos ? Array.from(anexos).map((file) => file.name) : [],
          }),
        })

        if (res.ok) {
          const novoDoc = await res.json()
          setDocumentos((prev) => [...prev, novoDoc])
        } else {
          alert("Erro ao salvar documento.")
          return
        }
      }

      // Limpar formulário
      setTipo("contrato")
      setConteudo("")
      setAutor("")
      setDataEmissao("")
      setAnexos(null)
      setErroAnexo(null)
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      console.error("[v0] Erro ao salvar/atualizar documento:", err)
      alert("Erro de rede ao processar documento.")
    }
  }

  const handleEditar = (doc: Documento) => {
    setEditandoId(doc.id)
    setTipo(doc.tipo)
    setAutor(doc.autor)
    setConteudo(doc.conteudo)
    setDataEmissao(new Date(doc.data_emissão).toISOString().split("T")[0])
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDeletar = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este documento?")) {
      return
    }

    try {
      const res = await fetch(`app/api/Documento_Api/Atualizar_Documento/Deletar_Documento?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setDocumentos((prev) => prev.filter((doc) => doc.id !== id))
      } else {
        alert("Erro ao deletar documento.")
      }
    } catch (err) {
      console.error("Erro ao deletar documento:", err)
      alert("Erro de rede ao deletar documento.")
    }
  }

  const handleCancelarEdicao = () => {
    setEditandoId(null)
    setTipo("contrato")
    setConteudo("")
    setAutor("")
    setDataEmissao("")
    setAnexos(null)
    setErroAnexo(null)
  }

  useEffect(() => {
    const carregarDocumentos = async () => {
      try {
        const res = await fetch("app/api/Documento_Api/Atualizar_Documento/Deletar_Documento/Listar_Documento")

        if (!res.ok) {
          console.log("Erro ao carregar documentos")
          return
        }
        const data = await res.json()
        setDocumentos(data)
      } catch (err) {
        console.error("[v0] Erro de rede ao carregar documentos:", err)
      }
    }

    carregarDocumentos()
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Painel de Documentos</h1>
        <p className="text-sm text-muted-foreground">Crie, edite e gerencie documentos com anexos válidos</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-card p-6 rounded-lg border"
      >
        {editandoId && (
          <div className="col-span-full bg-accent p-3 rounded-md flex items-center justify-between">
            <p className="text-sm font-medium">Editando documento</p>
            <Button type="button" variant="outline" size="sm" onClick={handleCancelarEdicao}>
              Cancelar
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Tipos_Documentos)}
              className="w-full border border-input bg-background rounded-md px-3 py-2"
            >
              {tiposPermitidos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data de Emissão</label>
            <input
              type="date"
              value={dataEmissao}
              onChange={(e) => setDataEmissao(e.target.value)}
              required
              className="w-full border border-input bg-background rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Autor</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
              className="w-full border border-input bg-background rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Conteúdo</label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              required
              rows={4}
              className="w-full border border-input bg-background rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Anexos</label>
            <input
              type="file"
              multiple
              onChange={handleAnexosChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {erroAnexo && <p className="text-sm text-destructive mt-1">{erroAnexo}</p>}
          </div>

          <Button type="submit" disabled={!!erroAnexo} className="w-full">
            {editandoId ? "Atualizar Documento" : "Criar Documento"}
          </Button>
        </div>
      </form>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentos.map((doc) => (
          <div
            key={doc.id}
            className="bg-card border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow relative"
          >
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleEditar(doc)}
                className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Editar documento"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>
              <button
                onClick={() => handleDeletar(doc.id)}
                className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center transition-colors text-destructive"
                aria-label="Deletar documento"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              </button>
            </div>

            <h2 className="text-xl font-semibold text-primary pr-20 mb-2">{doc.titulo_documento}</h2>
            <p className="text-sm text-muted-foreground">Tipo: {doc.tipo}</p>
            <p className="text-sm text-muted-foreground">
              Emissão: {new Date(doc.data_emissão).toLocaleDateString("pt-BR")}
            </p>
            <p className="mt-2 text-sm">{doc.conteudo}</p>
            <p className="text-sm mt-2 font-medium text-secondary-foreground">Autor: {doc.autor}</p>
            {doc.anexos && doc.anexos.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                {doc.anexos.map((file, index) => (
                  <li key={index}>
                    {file.name} {file.size > 0 && `(${Math.round(file.size / 1024)} KB)`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {documentos.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full text-center py-8">Nenhum documento criado ainda.</p>
        )}
      </section>
    </main>
  )
}
