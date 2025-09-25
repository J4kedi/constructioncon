'use client';

import { useState } from 'react';
import { Recurso, Tipos_Recursos } from '../../lib/recursos';
import Recursos_Factory from './recursos_factory';

export default function FactoryRecursos() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [tipo, setTipo] = useState<Tipos_Recursos>('material');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [nome, setNome] = useState('');
  const [recursoEditando, setRecursoEditando] = useState<null | number>(null);

  function handleAdicionarAtualizarRecurso(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    if (quantidade <= 0) {
      alert('Quantidade deve ser maior que zero');
      return;
    }

    if (recursoEditando !== null) {
    
      const novosRecursos = [...recursos];
      try {
        const recursoAtualizado = Recursos_Factory.criar({
          tipo,
          quantidade,
          id: novosRecursos[recursoEditando].id,
          nomeMaterial: tipo === 'material' ? nome : undefined,
          nomeEquipamento: tipo === 'equipamento' ? nome : undefined,
        });
        novosRecursos[recursoEditando] = recursoAtualizado;
        setRecursos(novosRecursos);
        setRecursoEditando(null);
      } catch (error: any) {
        alert(`Erro: ${error.message}`);
      }
    } else {

      try {
        const novoRecurso = Recursos_Factory.criar({
          tipo,
          quantidade,
          nomeMaterial: tipo === 'material' ? nome : undefined,
          nomeEquipamento: tipo === 'equipamento' ? nome : undefined,
        });
        setRecursos([...recursos, novoRecurso]);
      } catch (error: any) {
        alert(`Erro: ${error.message}`);
      }
    }

    setNome('');
    setQuantidade(1);
  }

  function handleEditarRecurso(index: number) {
    const r = recursos[index];
    setTipo(r.tipo);
    setQuantidade(r.quantidade);
    setNome(r.nome || '');
    setRecursoEditando(index);
  }

  function handleRemoverRecurso(index: number) {
    setRecursos(recursos.filter((_, i) => i !== index));
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerador de Recursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleAdicionarAtualizarRecurso} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Recurso</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as Tipos_Recursos)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="material">Material</option>
                <option value="equipamento">Equipamento</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade</label>
              <input
                type="number"
                value={quantidade}
                onChange={e => setQuantidade(parseInt(e.target.value) || 1)}
                min={1}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {recursoEditando !== null ? 'Atualizar Recurso' : 'Adicionar Recurso'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Recursos</h2>
          {recursos.length === 0 && <p>Nenhum recurso adicionado.</p>}
          {recursos.map((r, index) => (
            <div key={r.id} className="p-2 border border-gray-300 rounded mb-2">
              <p><strong>ID:</strong> {r.id}</p>
              <p><strong>Tipo:</strong> {r.tipo}</p>
              <p><strong>Nome:</strong> {r.nome}</p>
              <p><strong>Quantidade:</strong> {r.quantidade}</p>
              <p><em>{r.utilizar()}</em></p>
              <div className="mt-1">
                <button
                  onClick={() => handleEditarRecurso(index)}
                  className="mr-2 px-2 py-1 bg-yellow-400 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemoverRecurso(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

