import { LowStockItem } from '@/app/lib/definitions';
import { AlertCircle } from 'lucide-react';

export default function LowStockList({ items }: { items: LowStockItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-secondary/20 p-6 text-center">
        <p className="text-sm text-text/70">🎉 Nenhum item com estoque baixo. Tudo em ordem!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-secondary/20">
      <h3 className="p-4 text-lg font-medium text-text">Itens com Estoque Baixo</h3>
      <ul className="divide-y divide-secondary/30">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-warning" />
                <div>
                    <p className="font-medium text-text">{item.nome}</p>
                    <p className="text-xs text-text/70">Nível Mínimo: {String(item.nivelMinimo)} {item.unidade}</p>
                </div>
            </div>
            <p className="font-semibold text-destructive">
              {item.quantidadeAtual} {item.unidade}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
