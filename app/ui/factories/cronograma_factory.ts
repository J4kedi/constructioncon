// src/factory/cronogramaFactory.ts

export type Atividade = {
    id: string;
    descricao: string;
    duracaoDias: number;
    predecessoras: string[]; // IDs das atividades predecessoras
  };
  
  export type Cronograma = {
    tipo: "fisico" | "financeiro" | "fisico-financeiro";
    atividades: Atividade[];
    mostrarDetalhes: () => void;
  };
  
  function mostrarAtividades(atividades: Atividade[]) {
    atividades.forEach((atividade) => {
      console.log(
        `Atividade: ${atividade.descricao} | Duração: ${atividade.duracaoDias} dias | Predecessoras: ${
          atividade.predecessoras.length > 0 ? atividade.predecessoras.join(", ") : "Nenhuma"
        }`
      );
    });
  }
  
  export function criarCronograma(tipo: Cronograma["tipo"], atividades: Atividade[]): Cronograma {
    if (!["fisico", "financeiro", "fisico-financeiro"].includes(tipo)) {
      throw new Error("Tipo de cronograma inválido");
    }
  
    return {
      tipo,
      atividades,
      mostrarDetalhes: () => {
        console.log(`Cronograma tipo: ${tipo.toUpperCase()}`);
        mostrarAtividades(atividades);
      },
    };
  }
  