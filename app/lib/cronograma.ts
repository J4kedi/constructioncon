export interface Atividade {
  id: string;
  descricao: string;
  responsavel: string;
  inicio: Date;
  fim: Date;
  duracaoDias: number;
  predecessoras?: string[]; 
  status?: 'pendente' | 'em andamento' | 'concluída'; 
  cor?: string; 
}

export interface Cronograma {
  id: string;
  titulo: string; 
  tipo: Tipos_Cronograma;
  criadoEm: Date;
  atividades: Atividade[];
  observacoes?: string; 
}
