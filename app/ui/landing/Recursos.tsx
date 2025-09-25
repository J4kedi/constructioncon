'use client';
import { useState } from 'react';

export default function Recursos() {
  const [formData, setData] = useState({
    id: 0,
    tipo: '',
    quantidade: 1,
    nomeMaterial: '',
    nomeEquipamento: '',
  });

  const [resultado, setResultado] = useState<string | null>(null);

  const handler_mudanca = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData({
      ...formData,
      [name]: name === 'quantidade' ? Number(value) : value,
    });
  };

  const handler_submeter = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/Gerar_Recursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setResultado(JSON.stringify(data.recurso, null, 2));
    } else {
      setResultado(data.erro || 'Erro ao gerar recurso');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Selecionador de Recursos</h2>
      <form onSubmit={handler_submeter}>
        <label>Tipo:</label>
        <select name="tipo" value={formData.tipo} onChange={handler_mudanca}>
          <option value="">Selecione</option>
          <option value="material">Material</option>
          <option value="equipamento">Equipamento</option>
          <option value="mao_obra">Mão de Obra</option>
        </select>

        {formData.tipo === 'material' && (
          <>
            <label>Nome do Material:</label>
            <input
              type="text"
              name="nomeMaterial"
              value={formData.nomeMaterial}
              onChange={handler_mudanca}
            />
          </>
        )}

        {formData.tipo === 'equipamento' && (
          <>
            <label>Nome do Equipamento:</label>
            <input
              type="text"
              name="nomeEquipamento"
              value={formData.nomeEquipamento}
              onChange={handler_mudanca}
            />
          </>
        )}

        {formData.tipo === 'mao_obra' && (
          <>
            <label>Função:</label>
            <input
              type="text"
              name="funcao"
              value={formData.funcao}
              onChange={handler_mudanca}
            />
          </>
        )}

        <label>Quantidade:</label>
        <input
          type="number"
          name="quantidade"
          value={formData.quantidade}
          min={1}
          onChange={handler_mudanca}
        />

        <button type="submit">Criar Recurso</button>
      </form>

      {resultado && (
        <div style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem' }}>
          <pre>{resultado}</pre>
        </div>
      )}
    </div>
  );
}
