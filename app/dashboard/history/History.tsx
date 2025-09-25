import { historyentry } from "@/app/lib/history";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState<historyentry[]>([]);

  useEffect(() => {
    setHistory([]);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📜 Histórico da Obra</h1>
      <ul>
        {history.map((entry) => (
          <li key={entry.id} style={{ marginBottom: '1rem' }}>
            <strong>{entry.action}</strong> por <em>{entry.user}</em><br />
            <small>{new Date(entry.time).toLocaleString()}</small><br />
            {entry.details && <p>{entry.details}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}