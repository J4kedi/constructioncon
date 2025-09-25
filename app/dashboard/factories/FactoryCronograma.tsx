'use client';

import { useState } from 'react';

import { Atividade, Cronograma, Tipos_Cronograma} from '../../lib/cronograma';
import Cronograma_Factory from './cronograma_factory';

export default function FactoryCronograma() {
  const [cronogramas, setCronogramas] = useState<Cronograma[]>([]);
  const [tipo, setTipo] = useState<Tipos_Cronograma>('fisico');
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [descricao, setDescricao] = useState('');
  const [duracaoDias, setDuracaoDias] = useState(1);
  const [predecessoras, setPredecessoras] = useState<string>('');
  const [atividadeEditando, setAtividadeEditando] = useState<null | number>(null);

  function handleAdicionarAtualizarAtividade(e: React.FormEvent) {
    e.preventDefault();
    const predecessorasArray = predecessoras
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (descricao.trim() === '' || duracaoDias <= 0) {
      alert('Descrição e duração válida são obrigatórias');
      return;
    }

    if (atividadeEditando !== null) {
    
      const novasAtividades = [...atividades];
      novasAtividades[atividadeEditando] = {
        id: novasAtividades[atividadeEditando].id,
        descricao,
        duracaoDias,
        predecessoras: predecessorasArray.length > 0 ? predecessorasArray : undefined,
      };
      setAtividades(novasAtividades);
      setAtividadeEditando(null);
    } else {

      const novaAtividades: Atividade = {
        id: 'a' + (atividades.length + 1),
        descricao,
        responsavel: 'Nome do responsável',
        inicio: new Date(),                
        fim: new Date(),                   
        predecessoras
      };
      setAtividades([...atividades, novaAtividades]);
    }

    setDescricao('');
    setDuracaoDias(1);
    setPredecessoras('');
  }

  function handleEditarAtividade(index: number) {
    const atv = atividades[index];
    setDescricao(atv.descricao);
    setDuracaoDias(atv.duracaoDias);
    setPredecessoras(atv.predecessoras?.join(', ') || '');
    setAtividadeEditando(index);
  }

  function handleRemoverAtividade(index: number) {
    setAtividades(atividades.filter((_, i) => i !== index));
  }

  function handleCriarCronograma(e: React.FormEvent) {
    e.preventDefault();
    if (atividades.length === 0) {
      alert('Adicione ao menos uma atividade');
      return;
    }

    try {
      const novoCronograma = Cronograma_Factory.criar(tipo, atividades);
      setCronogramas([...cronogramas, novoCronograma]);
      setAtividades([]);
      setDescricao('');
      setDuracaoDias(1);
      setPredecessoras('');
    } catch (error: any) {
      alert(`Erro ao criar cronograma: ${error.message}`);
    }
  }

  function handleRemoverCronograma(id: string) {
    setCronogramas(cronogramas.filter(c => c.id !== id));
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerador de Cronogramas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleAdicionarAtualizarAtividade} className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold">Adicionar / Editar Atividade</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <input
                type="text"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duração (dias)</label>
              <input
                type="number"
                value={duracaoDias}
                onChange={e => setDuracaoDias(parseInt(e.target.value) || 1)}
                min={1}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Predecessoras (ids separados por vírgula)</label>
              <input
                type="text"
                value={predecessoras}
                onChange={e => setPredecessoras(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {atividadeEditando !== null ? 'Atualizar Atividade' : 'Adicionar Atividade'}
            </button>
          </form>

          <form onSubmit={handleCriarCronograma} className="space-y-4">
            <h2 className="text-xl font-semibold">Criar Cronograma</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Cronograma</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as Tipos_Cronograma)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="fisico">Físico</option>
                <option value="financeiro">Financeiro</option>
                <option value="fisico-financeiro">Físico-Financeiro</option>
              </select>
            </div>
            <div>
              <p className="mt-2">Atividades adicionadas: {atividades.length}</p>
              <button
                type="submit"
                className="mt-2 w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Criar Cronograma
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Atividades</h2>
          {atividades.length === 0 && <p>Nenhuma atividade adicionada.</p>}
          {atividades.map((atv, index) => (
            <div key={atv.id} className="p-2 border border-gray-300 rounded mb-2">
              <p><strong>ID:</strong> {atv.id}</p>
              <p><strong>Descrição:</strong> {atv.descricao}</p>
              <p><strong>Duração:</strong> {atv.duracaoDias} dias</p>
              <p><strong>Predecessoras:</strong> {atv.predecessoras?.join(', ') || 'Nenhuma'}</p>
              <div className="mt-1">
                <button
                  onClick={() => handleEditarAtividade(index)}
                  className="mr-2 px-2 py-1 bg-yellow-400 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemoverAtividade(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          <h2 className="text-xl font-semibold mt-6 mb-2">Cronogramas Criados</h2>
          {cronogramas.length === 0 && <p>Nenhum cronograma criado ainda.</p>}
          {cronogramas.map(c => (
            <div key={c.id} className="p-4 border border-gray-300 rounded mb-2 shadow">
              <h3 className="text-lg font-bold">{c.titulo}</h3>
              <p><strong>ID:</strong> {c.id}</p>
              <p><strong>Tipo:</strong> {c.tipo}</p>
              <p><strong>Criado em:</strong> {c.criadoEm.toLocaleDateString()}</p>
              <p><strong>Atividades:</strong> {c.atividades.length}</p>
              <p><em>{c.mostrarDetalhes()}</em></p>
              <button
                onClick={() => handleRemoverCronograma(c.id)}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
              >
                Remover Cronograma
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
