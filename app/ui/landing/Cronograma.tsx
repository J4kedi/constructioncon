'use client';
import { useState } from 'react';

export default function Cronograma() {
  const [formData, setData] = useState({
    id: 0,
    tipo: '',
    atividades: '',
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

    const atividadesArray = formData.atividades
      .split('\n')
      .map((linha) => {
        const [id, descricao, duracao, predecessoras] = linha
          .split(';')
          .map((t) => t.trim());
        return {
          id,
          descricao,
          duracaoDias: Number(duracao),
          predecessoras: predecessoras ? predecessoras.split(',') : [],
        };
      })
      .filter((a) => a.id && a.descricao);

    const res = await fetch('/api/Gerar_Cronograma', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, atividades: atividadesArray }),
    });

    const data = await res.json();
    if (res.ok) {
      setResultado(JSON.stringify(data.cronograma, null, 2));
    } else {
      setResultado(data.erro || 'Erro ao gerar cronograma');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Selecionador de Cronograma</h2>
      <form onSubmit={handler_submeter}>
        <label>Tipo:</label>
        <select name="tipo" value={formData.tipo} onChange={handler_mudanca}>
          <option value="">Selecione</option>
          <option value="fisico">Físico</option>
          <option value="financeiro">Financeiro</option>
          <option value="fisico-financeiro">Físico-Financeiro</option>
        </select>

        <label>Atividades (linha por linha):</label>
        <textarea
          name="atividades"
          value={formData.atividades}
          onChange={handler_mudanca}
          placeholder="id;descricao;duracaoDias;predecessoras"
          rows={6}
        />

        <button type="submit">Criar Cronograma</button>
      </form>

      {resultado && (
        <div style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem' }}>
          <pre>{resultado}</pre>
        </div>
      )}
    </div>
  );
}
