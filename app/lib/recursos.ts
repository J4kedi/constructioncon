export type Tipos_Recursos = 'material' | 'equipamento';

export interface Recurso {
  id: number;
  tipo: Tipos_Recursos;
  quantidade: number;
  nomeMaterial?: string;    
  nomeEquipamento?: string;          
}
