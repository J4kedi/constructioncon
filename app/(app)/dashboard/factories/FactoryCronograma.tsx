'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

interface Atividade {
  id: string;
  descricao: string;
  responsavel: string;
  inicio: Date;
  fim: Date;
  duracaoDias: number;
  predecessoras?: string[];
}

export default function FactoryCronograma() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  function gerarEventosCalendar() {
    return atividades.map(atv => ({
      id: atv.id,
      title: atv.descricao,
      start: atv.inicio,
      end: atv.fim,
    }));
  }

  async function handleAdicionarTarefa() {
    if (!descricao || !data || !hora) {
      alert('Preencha todos os campos.');
      return;
    }

    const inicio = new Date(`${data}T${hora}`);
    const fim = new Date(inicio);
    fim.setHours(inicio.getHours() + 1);

    const novaAtividade: Atividade = {
      id: crypto.randomUUID(),
      descricao,
      responsavel: 'Responsável padrão',
      inicio,
      fim,
      duracaoDias: 0,
    };

    try {
      const response = await fetch('/api/Salvar_Atividade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaAtividade),
      });

      if (response.ok) {
        setAtividades(prev => [...prev, novaAtividade]);
        setDescricao('');
        setData('');
        setHora('');
        setShowForm(false);
        alert('Tarefa adicionada com sucesso!');
      } else {
        alert('Erro ao salvar tarefa.');
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      alert('Erro de conexão com o servidor.');
    }
  }

  async function handleAgendarEntrega() {
    const entrega = {
      projeto: 'Projeto Exemplo',
      dataEntrega: new Date().toISOString(),
      atividades,
    };

    try {
      const response = await fetch('/api/Gerar_Cronograma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entrega),
      });

      if (response.ok) {
        alert('Entrega agendada com sucesso!');
      } else {
        alert('Erro ao agendar entrega.');
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
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background text-text"
            />

            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-background text-text"
            />

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
