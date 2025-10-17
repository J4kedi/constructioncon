'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Button } from '@/app/ui/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import { Input } from '@/app/ui/components/Input';
import { Label } from '@/app/ui/components/Label';
import { toast } from '@/app/ui/components/hooks/use-toast';
import { Calendar, Plus, Edit2, X, Trash2 } from 'lucide-react';

interface Atividade {
  id: string;
  descricao: string;
  responsavel: string;
  inicio: string;
  fim: string;
  duracaoDias: number;
  createdAt?: string;
}

export const Index = () => {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [idEditando, setIdEditando] = useState<string | null>(null);

  useEffect(() => {
    carregarAtividades();
  }, []);

  function carregarAtividades() {
    try {
      const atividadesSalvas = localStorage.getItem('atividades');
      if (atividadesSalvas) {
        setAtividades(JSON.parse(atividadesSalvas));
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as atividades.',
        variant: 'destructive',
      });
    }
  }

  function salvarAtividades(novasAtividades: Atividade[]) {
    try {
      localStorage.setItem('atividades', JSON.stringify(novasAtividades));
      setAtividades(novasAtividades);
    } catch (error) {
      console.error('Erro ao salvar atividades:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as atividades.',
        variant: 'destructive',
      });
    }
  }

  function gerarEventosCalendar() {
    return atividades.map(atv => ({
      id: atv.id,
      title: atv.descricao,
      start: atv.inicio,
      end: atv.fim,
      backgroundColor: 'hsl(var(--primary))',
      borderColor: 'hsl(var(--primary))',
    }));
  }

  function validarCampos(): boolean {
    if (!descricao || !responsavel || !dataInicio || !horaInicio || !dataFim || !horaFim) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos.',
        variant: 'destructive',
      });
      return false;
    }

    const inicio = new Date(`${dataInicio}T${horaInicio}`);
    const fim = new Date(`${dataFim}T${horaFim}`);

    if (inicio >= fim) {
      toast({
        title: 'Data inválida',
        description: 'A data de início deve ser anterior à data de fim.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  }

  function handleSalvarTarefa() {
    if (!validarCampos()) return;

    const inicio = new Date(`${dataInicio}T${horaInicio}`);
    const fim = new Date(`${dataFim}T${horaFim}`);
    const duracaoDias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    const novaTarefa: Atividade = {
      id: idEditando || `atv-${Date.now()}`,
      descricao,
      responsavel,
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      duracaoDias,
      createdAt: new Date().toISOString(),
    };

    if (idEditando) {
      const atividadesAtualizadas = atividades.map(atv =>
        atv.id === idEditando ? novaTarefa : atv
      );
      salvarAtividades(atividadesAtualizadas);
      toast({
        title: 'Sucesso!',
        description: 'Tarefa atualizada com sucesso!',
      });
    } else {
      salvarAtividades([...atividades, novaTarefa]);
      toast({
        title: 'Sucesso!',
        description: 'Tarefa adicionada com sucesso!',
      });
    }

    limparFormulario();
  }

  function limparFormulario() {
    setIdEditando(null);
    setDescricao('');
    setResponsavel('');
    setDataInicio('');
    setHoraInicio('');
    setDataFim('');
    setHoraFim('');
    setShowForm(false);
  }

  function preencherFormulario(atv: Atividade) {
    const ini = new Date(atv.inicio);
    const fim = new Date(atv.fim);
    setIdEditando(atv.id);
    setDescricao(atv.descricao);
    setResponsavel(atv.responsavel);
    setDataInicio(ini.toISOString().slice(0, 10));
    setHoraInicio(ini.toISOString().slice(11, 16));
    setDataFim(fim.toISOString().slice(0, 10));
    setHoraFim(fim.toISOString().slice(11, 16));
    setShowForm(true);
  }

  function handleExcluirTarefa(id: string, descricao: string) {
    if (confirm(`Deseja realmente excluir a tarefa "${descricao}"?`)) {
      const atividadesAtualizadas = atividades.filter(atv => atv.id !== id);
      salvarAtividades(atividadesAtualizadas);
      toast({
        title: 'Tarefa excluída',
        description: 'A tarefa foi removida com sucesso.',
      });
    }
  }

  return (
  <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} className="min-h-screen p-4 md:p-8">
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="text-center space-y-2 mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Calendar className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
          <h1
  className="text-4xl font-bold bg-clip-text text-transparent"
  style={{
    backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
  }}
>
  Calendário de Atividades
</h1>

        </div>
        <p style={{ color: 'var(--color-text--black)' }} className="text-lg opacity-70">
          Gerencie suas tarefas de forma eficiente
        </p>
      </header>
      <div className="flex justify-center">
  <div className="w-full max-w-5xl">
    <Card
      className="shadow-lg"
      style={{
        backgroundColor: 'var(--color-white)',
        color: 'var(--color-black)',
      }}
    >
      <CardContent className="p-6">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={gerarEventosCalendar()}
          locale={ptBrLocale}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          displayEventEnd={true}
        />
      </CardContent>
    </Card>
  </div>
</div>



      {atividades.length > 0 && (
        <Card className="shadow-lg" style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-text)' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Tarefas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {atividades.map(atv => (
                <li
                  key={atv.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border hover:shadow-md transition-all duration-200"
                  style={{
                    backgroundImage: 'linear-gradient(to right, var(--color-accent), var(--color-secondary))',
                    borderColor: 'var(--color-secondary)',
                  }}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                      {atv.descricao}
                    </p>
                    <p className="text-sm opacity-70">
                      Responsável: <span className="font-medium" style={{ color: 'var(--color-text)' }}>{atv.responsavel}</span>
                    </p>
                    <p className="text-sm opacity-70">
                      Início: {new Date(atv.inicio).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm opacity-70">
                      Fim: {new Date(atv.fim).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => preencherFormulario(atv)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleExcluirTarefa(atv.id, atv.descricao)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <div className="flex justify-center">
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      )}

      {showForm && (
        <Card className="shadow-lg" style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-text)' }}>
          <CardHeader>
            <CardTitle className="text-2xl">
              {idEditando ? 'Editar Tarefa' : 'Adicionar Tarefa'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição da tarefa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaInicio">Hora de Início</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaFim">Hora de Fim</Label>
                <Input
                  id="horaFim"
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button onClick={handleSalvarTarefa} className="gap-2">
                <Calendar className="w-4 h-4" />
                {idEditando ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={limparFormulario} className="gap-2">
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
);
};