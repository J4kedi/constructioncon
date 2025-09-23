// src/factory/recursosFactory.ts

export type RecursoBase = {
    tipo: "material" | "equipamento" | "mao_obra";
    quantidade: number;
    utilizar: () => void;
  };
  
  export type Material = RecursoBase & {
    tipo: "material";
    nomeMaterial: string;
  };
  
  export type Equipamento = RecursoBase & {
    tipo: "equipamento";
    nomeEquipamento: string;
  };
  
  export type MaoDeObra = RecursoBase & {
    tipo: "mao_obra";
    funcao: string;
  };
  
  export type Recurso = Material | Equipamento | MaoDeObra;
  
  export function criarRecurso(recurso: {
    tipo: RecursoBase["tipo"];
    quantidade: number;
    nomeMaterial?: string;
    nomeEquipamento?: string;
    funcao?: string;
  }): Recurso {
    switch (recurso.tipo) {
      case "material":
        if (!recurso.nomeMaterial) throw new Error("Nome do material obrigatório");
        return {
          tipo: "material",
          quantidade: recurso.quantidade,
          nomeMaterial: recurso.nomeMaterial,
          utilizar: () =>
            console.log(`Utilizando ${recurso.quantidade} unidade(s) de material: ${recurso.nomeMaterial}`),
        };
      case "equipamento":
        if (!recurso.nomeEquipamento) throw new Error("Nome do equipamento obrigatório");
        return {
          tipo: "equipamento",
          quantidade: recurso.quantidade,
          nomeEquipamento: recurso.nomeEquipamento,
          utilizar: () =>
            console.log(`Utilizando ${recurso.quantidade} equipamento(s): ${recurso.nomeEquipamento}`),
        };
      case "mao_obra":
        if (!recurso.funcao) throw new Error("Função da mão de obra obrigatória");
        return {
          tipo: "mao_obra",
          quantidade: recurso.quantidade,
          funcao: recurso.funcao,
          utilizar: () =>
            console.log(`Utilizando ${recurso.quantidade} trabalhador(es) na função: ${recurso.funcao}`),
        };
      default:
        throw new Error("Tipo de recurso inválido");
    }
  }
  