export type Tipos_Cronograma = 'fisico' | 'financeiro' | 'fisico-financeiro';

export interface Atividade {
  id: string;
  descricao: string;
  responsavel: string;
  inicio: Date;
  fim: Date;
  duracaoDias?: number;
  predecessoras: number
}

export interface Cronograma {
  id: string;
  tipo: Tipos_Cronograma;
  criado_em: Date;
  atividades: Atividade[];
}
