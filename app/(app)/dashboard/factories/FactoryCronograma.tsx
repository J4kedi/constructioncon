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

  function gerarEventosCalendar() {
    return atividades.map(atv => ({
      id: atv.id,
      title: atv.descricao,
      start: atv.inicio,
      end: atv.fim,
    }));
  }

  async function handleAgendarEntrega() {
    const entrega = {
      projeto: 'Projeto Exemplo',
      dataEntrega: new Date().toISOString(),
      atividades,
    };

    try {
      const response = await fetch('http://localhost:3000/api/Gerar_Cronograma', {
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

        <button
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-accent disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleAgendarEntrega}
        >
          Agendar Entrega do Projeto
        </button>
      </div>
    </div>
  );
}
