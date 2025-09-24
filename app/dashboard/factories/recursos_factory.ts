// Factory responsável por criar e validar recursos (materiais, equipamentos e mão de obra)
export type RecursoTipo = 'material' | 'equipamento' | 'mao_obra';

export type Recurso = {
  id: string;
  tipo: RecursoTipo;
  quantidade: number;
  nome?: string;   // usado em material/equipamento
  funcao?: string; // usado em mão de obra
  utilizar: () => string; // método utilitário para uso do recurso
  toJSON: () => any;      // serialização
};

export const Recursos_Factory = {
  criar: (payload: {
    tipo: RecursoTipo;
    quantidade: number;
    nomeMaterial?: string;
    nomeEquipamento?: string;
    funcao?: string;
    id?: string;
  }): Recurso => {
    if (payload.quantidade <= 0) throw new Error('Quantidade deve ser maior que zero');
    const id = payload.id ?? 'rec_' + Math.random().toString(36).slice(2, 9);

    // cria o recurso de acordo com o tipo escolhido
    switch (payload.tipo) {
      case 'material':
        return {
          id,
          tipo: 'material',
          quantidade: payload.quantidade,
          nome: payload.nomeMaterial!,
          utilizar: () => `Usando ${payload.quantidade}x material: ${payload.nomeMaterial}`,
          toJSON: () => ({ id, tipo: 'material', quantidade: payload.quantidade, nome: payload.nomeMaterial }),
        };
      case 'equipamento':
        return {
          id,
          tipo: 'equipamento',
          quantidade: payload.quantidade,
          nome: payload.nomeEquipamento!,
          utilizar: () => `Usando ${payload.quantidade}x equipamento: ${payload.nomeEquipamento}`,
          toJSON: () => ({ id, tipo: 'equipamento', quantidade: payload.quantidade, nome: payload.nomeEquipamento }),
        };
      case 'mao_obra':
        return {
          id,
          tipo: 'mao_obra',
          quantidade: payload.quantidade,
          funcao: payload.funcao!,
          utilizar: () => `Usando ${payload.quantidade} trabalhador(es) na função: ${payload.funcao}`,
          toJSON: () => ({ id, tipo: 'mao_obra', quantidade: payload.quantidade, funcao: payload.funcao }),
        };
      default:
        throw new Error('Tipo inválido');
    }
  },
};

export default Recursos_Factory;
