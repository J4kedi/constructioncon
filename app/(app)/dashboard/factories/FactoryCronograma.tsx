'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

interface Atividade {
  id: string;
  descricao: string;
  responsavel: string;
  inicio: string; // ISO string
  fim: string;    // ISO string
  duracaoDias: number;
  createdAt?: string;
}

export default function FactoryCronograma() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('');

  function gerarEventosCalendar() {
    return atividades.map(atv => ({
      id: atv.id,
      title: atv.descricao,
      start: atv.inicio,
      end: atv.fim,
    }));
  }

  async function handleAdicionarTarefa() {
    if (!descricao || !responsavel || !dataInicio || !horaInicio || !dataFim || !horaFim) {
      alert('Preencha todos os campos.');
      return;
    }

    const inicio = new Date(`${dataInicio}T${horaInicio}`);
    const fim = new Date(`${dataFim}T${horaFim}`);

    const payload = {
      descricao,
      responsavel,
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
    };

    try {
      const response = await fetch('app/api/Salvar_Atividade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const atividadeSalva = await response.json();
        setAtividades(prev => [...prev, atividadeSalva]);
        setDescricao('');
        setResponsavel('');
        setDataInicio('');
        setHoraInicio('');
        setDataFim('');
        setHoraFim('');
        setShowForm(false);
        alert('Tarefa adicionada com sucesso!');
      } else {
        const erro = await response.json();
        alert(`Erro ao salvar tarefa: ${erro.error}`);
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      alert('Erro de conexão com o servidor.');
    }
  }

  return (
    <div className="min-h-screen p-8 bg-background text-text transition-colors duration-300">
      <h1 className="text-3xl font-bold text-center mb-6">Calendário de Atividades</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-background rounded-lg shadow-md p-4">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={gerarEventosCalendar()}
            locale={ptBrLocale}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek',
            }}
          />
        </div>

        {!showForm && (
          <button
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-accent"
            onClick={() => setShowForm(true)}
          >
            Nova Tarefa
          </button>
        )}

        {showForm && (
          <div className="bg-white dark:bg-background rounded-lg shadow-md p-4 space-y-4">
            <h2 className="text-xl font-semibold">Adicionar Tarefa</h2>

            <input
              type="text"
              placeholder="Descrição da tarefa"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background text-text"
            />

            <input
              type="text"
              placeholder="Responsável"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background text-text"
            />

            <label className="block font-semibold">Início</label>
            <div className="flex gap-4">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background text-text"
              />
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background text-text"
              />
            </div>

            <label className="block font-semibold">Fim</label>
            <div className="flex gap-4">
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background text-text"
              />
              <input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background text-text"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAdicionarTarefa}
                className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-accent"
              >
                Salvar Tarefa
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-destructive text-white font-bold py-3 px-4 rounded-lg hover:bg-destructive transition-all duration-300 shadow-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
