'use client';
import { useState } from 'react';

// Componente de formulário para criação de cronogramas
export default function Cronograma() {
  const [formData, setData] = useState({ tipo: '', atividades: '' });
  const [resultado, setResultado] = useState<string | null>(null);

  // Atualiza o estado conforme o usuário digita
  const handler_mudanca = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envia o formulário para a API
  const handler_submeter = async (e: React.FormEvent) => {
    e.preventDefault();

    // converte o texto em array de atividades
    const atividadesArray = formData.atividades
      .split('\n')
      .map((linha) => {
        const [id, descricao, duracao, predecessoras] = linha.split(';').map((t) => t.trim());
        return { id, descricao, duracaoDias: Number(duracao), predecessoras: predecessoras ? predecessoras.split(',') : [] };
      })
      .filter((a) => a.id && a.descricao);

    const res = await fetch('/api/Gerar_Cronograma', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: formData.tipo, atividades: atividadesArray }),
    });

    const data = await res.json();
    setResultado(res.ok ? JSON.stringify(data.cronograma, null, 2) : data.erro);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Criar Cronograma</h2>
      <form onSubmit={handler_submeter}>
        {/* seleção do tipo */}
        <label>Tipo:</label>
        <select name="tipo" value={formData.tipo} onChange={handler_mudanca}>
          <option value="">Selecione</option>
          <option value="fisico">Físico</option>
          <option value="financeiro">Financeiro</option>
          <option value="fisico-financeiro">Físico-Financeiro</option>
        </select>

        {/* campo de atividades, linha por linha */}
        <label>Atividades:</label>
        <textarea
          name="atividades"
          value={formData.atividades}
          onChange={handler_mudanca}
          placeholder="id;descricao;duracaoDias;predecessoras"
          rows={6}
        />

        <button type="submit">Criar Cronograma</button>
      </form>

      {/* exibe o resultado da API */}
      {resultado && <pre>{resultado}</pre>}
    </div>
  );
}
