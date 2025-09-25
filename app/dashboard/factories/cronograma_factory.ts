import { Tipos_Cronograma } from '../../lib/cronograma';

const Titulos_Por_Tipo: Record<Tipos_Cronograma, string> = {
  fisico: 'Cronograma Físico',
  financeiro: 'Cronograma Financeiro',
  'fisico-financeiro': 'Cronograma Físico-Financeiro',
}

let id_contador = 1;

export type Atividade = {
  id: string;
  descricao: string;
  duracaoDias: number;
  predecessoras?: string[];
};

export type CronogramaTipo = 'fisico' | 'financeiro' | 'fisico-financeiro';

function validarAtividades(atividades: Atividade[]) {
  if (!Array.isArray(atividades)) throw new Error('Atividades devem ser um array');

  const ids = new Set(atividades.map((a) => a.id));
  if (ids.size !== atividades.length) throw new Error('IDs duplicados ou ausentes');

  atividades.forEach((a) => {
    if (!a.id) throw new Error('Atividade sem id');
    if (!a.descricao.trim()) throw new Error(`Atividade ${a.id} sem descrição`);
    if (a.duracaoDias <= 0) throw new Error(`Atividade ${a.id} com duração inválida`);

    (a.predecessoras || []).forEach((p) => {
      if (p && !ids.has(p)) throw new Error(`Predecessora '${p}' não existe`);
    });
  });
}

export type Cronograma = {
  id: string;
  tipo: CronogramaTipo;
  titulo: string;
  atividades: Atividade[];
  criadoEm: Date;

  mostrarDetalhes: () => string;
  toJSON: () => any;
};

export class Cronograma_Factory {
  static criar(
    tipo: CronogramaTipo,
    atividades: Atividade[],
    id?: string
  ): Cronograma {
    const tiposValidos: CronogramaTipo[] = ['fisico', 'financeiro', 'fisico-financeiro'];
    if (!tiposValidos.includes(tipo)) throw new Error('Tipo inválido');

    validarAtividades(atividades);

    return {
      id: id ?? 'cron_' + (id_contador++).toString(),
      tipo,
      titulo: Titulos_Por_Tipo[tipo],
      atividades,
      criadoEm: new Date(),

      mostrarDetalhes() {
        return `Cronograma (${this.id} - ${this.titulo}) com ${this.atividades.length} atividades criadas em ${this.criadoEm.toLocaleDateString()}`;
      },

      toJSON() {
        return {
          id: this.id,
          tipo: this.tipo,
          titulo: this.titulo,
          atividades: this.atividades,
          criadoEm: this.criadoEm.toISOString(),
        };
      },
    };
  }
}

export default Cronograma_Factory;
