'use client';

import { useState } from 'react';
import { Box, Typography, Card, Grid, Button } from '@mui/material';
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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Calendário de Atividades
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
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
          </Card>

 <Button
  variant="contained"
  fullWidth
  sx={{
    mt: 3,
    py: 3,
    px: 4,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#4f46e5', 
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: 6,
    '&:hover': {
      backgroundColor: '#4f46e5',
      boxShadow: '0 4px 20px rgba(186, 104, 200, 0.4)',
    },
    '&:disabled': {
      backgroundColor: '#4f46e5',
      cursor: 'not-allowed',
    },
  }}
  onClick={handleAgendarEntrega}
>
  Agendar Entrega do Projeto
</Button>

        </Grid>
      </Grid>
    </Box>
  );
}
