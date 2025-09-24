'use client';
import { useState } from 'react';

// Componente de formulário para criação de recursos
export default function Recursos() {
  const [formData, setData] = useState({
    tipo: '',
    quantidade: 1,
    nomeMaterial: '',
    nomeEquipamento: '',
    funcao: '',
  });
  const [resultado, setResultado] = useState<string | null>(null);

  // Atualiza o estado dos inputs
  const handler_mudanca = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData({ ...formData, [name]: name === 'quantidade' ? Number(value) : value });
  };

  // Envia os dados para a API
  const handler_submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/Gerar_Recursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResultado(res.ok ? JSON.stringify(data.recurso, null, 2) : data.erro);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Criar Recurso</h2>
      <form onSubmit={handler_submeter}>
        {/* seleção do tipo de recurso */}
        <label>Tipo:</label>
        <select name="tipo" value={formData.tipo} onChange={handler_mudanca}>
          <option value="">Selecione</option>
          <option value="material">Material</option>
          <option value="equipamento">Equipamento</option>
          <option value="mao_obra">Mão de Obra</option>
        </select>

        {/* campos exibidos de acordo com o tipo */}
        {formData.tipo === 'material' && (
          <>
            <label>Nome do Material:</label>
            <input type="text" name="nomeMaterial" value={formData.nomeMaterial} onChange={handler_mudanca} />
          </>
        )}
        {formData.tipo === 'equipamento' && (
          <>
            <label>Nome do Equipamento:</label>
            <input type="text" name="nomeEquipamento" value={formData.nomeEquipamento} onChange={handler_mudanca} />
          </>
        )}
        {formData.tipo === 'mao_obra' && (
          <>
            <label>Função:</label>
            <input type="text" name="funcao" value={formData.funcao} onChange={handler_mudanca} />
          </>
        )}

        <label>Quantidade:</label>
        <input type="number" name="quantidade" value={formData.quantidade} min={1} onChange={handler_mudanca} />

        <button type="submit">Criar Recurso</button>
      </form>

      {/* resultado retornado pela API */}
      {resultado && <pre>{resultado}</pre>}
    </div>
  );
}
