'use client';

import { useState } from 'react';
import { Documento, Tipos_Documentos } from '../../../lib/documento';
import { Document_Factory } from '../factories/Document_Factory';

const tiposPermitidos: Tipos_Documentos[] = ['contrato', 'orçamento', 'certidão', 'relatórios'];
const extensoesPermitidas = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'];

export default function DocumentosDashboard() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [tipo, setTipo] = useState<Tipos_Documentos>('contrato');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [anexos, setAnexos] = useState<FileList | null>(null);
  const [erroAnexo, setErroAnexo] = useState<string | null>(null);

  const handleAnexosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = e.target.files;
    if (!arquivos) return;

    const arquivosValidos: File[] = [];
    let erroDetectado = false;

    Array.from(arquivos).forEach((file) => {
      const extensao = file.name.split('.').pop()?.toLowerCase();
      if (extensao && extensoesPermitidas.includes(extensao)) {
        arquivosValidos.push(file);
      } else {
        erroDetectado = true;
      }
    });

    if (erroDetectado) {
      setErroAnexo('Só são aceitos arquivos PDF, Word, Excel ou imagens (PNG, JPG).');
      setAnexos(null);
    } else {
      setErroAnexo(null);
      const dt = new DataTransfer();
      arquivosValidos.forEach((file) => dt.items.add(file));
      setAnexos(dt.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tiposPermitidos.includes(tipo)) {
      alert('Tipo de documento inválido. Escolha entre contrato, orçamento, certidão ou relatórios.');
      return;
    }

    const listaDeAnexos = anexos ? Array.from(anexos) : undefined;
    const dataCorrigida = new Date(`${dataEmissao}T00:00:00`);

    const novoDocumento = Document_Factory.criarDocumento(
      tipo,
      dataCorrigida,
      conteudo,
      autor,
      listaDeAnexos
    );

    setDocumentos([...documentos, novoDocumento]);

    setTipo('contrato');
    setConteudo('');
    setAutor('');
    setDataEmissao('');
    setAnexos(null);
    setErroAnexo(null);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Painel de Documentos</h1>
        <p className="text-sm text-[var(--color-secondary)]">Crie documentos com anexos válidos</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Tipos_Documentos)}
              className="w-full border rounded px-3 py-2"
            >
              {tiposPermitidos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Data de Emissão</label>
            <input
              type="date"
              value={dataEmissao}
              onChange={(e) => setDataEmissao(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Autor</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Conteúdo</label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Anexos</label>
            <input
              type="file"
              multiple
              onChange={handleAnexosChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--color-accent)] file:text-[var(--color-white)] hover:file:bg-indigo-300"
            />
            {erroAnexo && (
              <p className="text-sm text-[var(--color-destructive)] mt-1">{erroAnexo}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!!erroAnexo}
            className={`px-4 py-2 rounded transition ${
              erroAnexo
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[var(--color-success)] text-[var(--color-success-foreground)] hover:bg-green-600'
            }`}
          >
            Criar Documento
          </button>
        </div>
      </form>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentos.map((doc) => (
          <div key={doc.id} className="bg-white text-black border rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)]">{doc.titulo_documento}</h2>
            <p className="text-sm text-gray-600">Tipo: {doc.tipo}</p>
            <p className="text-sm text-gray-600">
              Emissão: {new Date(doc.data_emissão).toLocaleDateString()}
            </p>
            <p className="mt-2">{doc.conteudo}</p>
            <p className="text-sm mt-2 font-medium text-[var(--color-secondary)]">Autor: {doc.autor}</p>
            {doc.anexos && doc.anexos.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                {doc.anexos.map((file, index) => (
                  <li key={index}>
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {documentos.length === 0 && (
          <p className="text-[var(--color-warning)] text-sm">Nenhum documento criado ainda.</p>
        )}
      </section>
    </main>
  );
}
