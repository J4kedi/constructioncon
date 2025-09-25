import { Paticao } from "@/app/lib/paticao";
import { useEffect, useState } from "react";

export default function PaticoesPage() {
  const [paticoes, setPaticoes] = useState<Paticao[]>([]);

  useEffect(() => {
    // Simula carregamento de dados
    setPaticoes([]);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏢 Participantes do Projeto</h1>
      <ul>
        {paticoes.map((p) => (
          <li key={p.id} style={{ marginBottom: '1.5rem' }}>
            <strong>{p.nome} ({p.sigla})</strong><br />
            <p>{p.descricao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
