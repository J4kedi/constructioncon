// Factory responsável por criar e validar cronogramas
export type Atividade = {
  id: string;                  // identificador único da atividade
  descricao: string;           // descrição da atividade
  duracaoDias: number;         // duração em dias
  predecessoras?: string[];    // ids das atividades predecessoras
};

export type CronogramaTipo = 'fisico' | 'financeiro' | 'fisico-financeiro';

export type Cronograma = {
  id: string;
  tipo: CronogramaTipo;
  atividades: Atividade[];
  criadoEm: Date;
  mostrarDetalhes: () => string;   // método utilitário para visualizar resumo
  toJSON: () => any;               // método para serializar em JSON
};

// Função auxiliar que valida as atividades do cronograma
function validarAtividades(atividades: Atividade[]) {
  if (!Array.isArray(atividades)) throw new Error('Atividades devem ser um array');

  const ids = new Set(atividades.map((a) => a.id));
  if (ids.size !== atividades.length) throw new Error('IDs duplicados ou ausentes');

  atividades.forEach((a) => {
    if (!a.id) throw new Error('Atividade sem id');
    if (!a.descricao.trim()) throw new Error(`Atividade ${a.id} sem descrição`);
    if (a.duracaoDias <= 0) throw new Error(`Atividade ${a.id} com duração inválida`);
    // verifica se todas predecessoras existem
    (a.predecessoras || []).forEach((p) => {
      if (p && !ids.has(p)) throw new Error(`Predecessora '${p}' não existe`);
    });
  });
}

// Factory de cronogramas
export const Cronograma_Factory = {
  criar: (tipo: CronogramaTipo, atividades: Atividade[], id?: string): Cronograma => {
    const tiposValidos: CronogramaTipo[] = ['fisico', 'financeiro', 'fisico-financeiro'];
    if (!tiposValidos.includes(tipo)) throw new Error('Tipo inválido');

    validarAtividades(atividades);

    return {
      id: id ?? 'cron_' + Math.random().toString(36).slice(2, 9),
      tipo,
      atividades,
      criadoEm: new Date(),
      mostrarDetalhes() {
        return `Cronograma (${this.id}) com ${this.atividades.length} atividades`;
      },
      toJSON() {
        return { id: this.id, tipo: this.tipo, atividades: this.atividades, criadoEm: this.criadoEm.toISOString() };
      },
    };
  },
};

export default Cronograma_Factory;
