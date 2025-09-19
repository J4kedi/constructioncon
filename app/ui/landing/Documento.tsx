'use client';
import { useState } from 'react';
export default function Documento() {
  const [formData, setData] = useState({
    id: 0,
    tipo: '',
    titulo_documento: '',
    data_emissão: new Date(),
    conteudo: '',
    autor: '',
    anexos: '',
  });

  const [resultado, setResultado] = useState<string | null>(null);

  const handler_mudanca = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handler_submeter = async (e: React.FormEvent) => {
    e.preventDefault();

    const anexosArray = formData.anexos
      .split(',')
      .map((anexo) => anexo.trim())
      .filter((a) => a);

    const res = await fetch('/api/Gerar_Documentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, anexos: anexosArray }),
    });

    const data = await res.json();
    if (res.ok) {
      setResultado(JSON.stringify(data.documents, null, 2));
    } else {
      setResultado(data.erro || 'Erro ao gerar documento');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Selecionador de Documentos</h2>
      <form onSubmit={handler_submeter}>
        <label>Tipo:</label>
        <select name="tipo" value={formData.tipo} onChange={handler_mudanca}>
          <option value="">Selecione</option>
          <option value="contrato">Contrato</option>
          <option value="orçamento">Orçamento</option>
          <option value="certidão">Certidão</option>
          <option value="relatórios">Relatórios</option>
        </select>

        <label>Autor:</label>
        <input type="text" name="autor" value={formData.autor} onChange={handler_mudanca} />

        <label>Conteúdo:</label>
        <textarea name="conteudo" value={formData.conteudo} onChange={handler_mudanca} />

        <label>Anexos (separados por vírgula):</label>
        <input type="text" name="anexos" value={formData.anexos} onChange={handler_mudanca} />

        <button type="submit">Criar Documento</button>
      </form>

      {resultado && (
        <div style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem' }}>
          <pre>{resultado}</pre>
        </div>
      )}
    </div>
  );
}
