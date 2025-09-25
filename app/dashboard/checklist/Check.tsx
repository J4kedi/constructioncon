import { Checklist } from "@/app/lib/check";
import { useEffect, useState } from "react";

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  useEffect(() => {
    setChecklists([]);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📋 Checklists das Obras</h1>
      <ul>
        {checklists.map((item) => (
          <li key={item.id} style={{ marginBottom: '1.5rem' }}>
            <strong>{item.nome}</strong> {item.concluido ? '✅' : '❌'}<br />
            <em>Obra #{item.obraID}</em><br />
            <small>{new Date(item.data).toLocaleDateString()}</small><br />
            <p>{item.descricao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}