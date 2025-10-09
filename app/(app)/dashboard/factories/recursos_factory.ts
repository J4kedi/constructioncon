export type RecursoTipo = 'material' | 'equipamento';

let id_contador = 1;

const Titulos_Por_Tipo: Record<RecursoTipo, string> = {
  material: 'Recurso Material',
  equipamento: 'Recurso Equipamento',
};

export type Recurso = {
  id: string;
  tipo: RecursoTipo;
  quantidade: number;
  nome?: string; 

  utilizar: () => string;
  toJSON: () => any;
};

export class Recursos_Factory {
  static criar(payload: {
    tipo: RecursoTipo;
    quantidade: number;
    nomeMaterial?: string;
    nomeEquipamento?: string;
    id?: string;
  }): Recurso {
    if (payload.quantidade <= 0) throw new Error('Quantidade deve ser maior que zero');

    const id = payload.id ?? 'rec_' + (id_contador++).toString();

    switch (payload.tipo) {
      case 'material':
        if (!payload.nomeMaterial) throw new Error('nomeMaterial é obrigatório para material');
        return {
          id,
          tipo: 'material',
          quantidade: payload.quantidade,
          nome: payload.nomeMaterial,
          utilizar: () => `Usando ${payload.quantidade}x material: ${payload.nomeMaterial}`,
          toJSON: () => ({ id, tipo: 'material', quantidade: payload.quantidade, nome: payload.nomeMaterial }),
        };

      case 'equipamento':
        if (!payload.nomeEquipamento) throw new Error('nomeEquipamento é obrigatório para equipamento');
        return {
          id,
          tipo: 'equipamento',
          quantidade: payload.quantidade,
          nome: payload.nomeEquipamento,
          utilizar: () => `Usando ${payload.quantidade}x equipamento: ${payload.nomeEquipamento}`,
          toJSON: () => ({ id, tipo: 'equipamento', quantidade: payload.quantidade, nome: payload.nomeEquipamento }),
        };

      default:
        throw new Error('Tipo inválido');
    }
  }
}

export default Recursos_Factory;
