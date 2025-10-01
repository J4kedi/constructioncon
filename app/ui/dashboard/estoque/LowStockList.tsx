import { CatalogoItem } from '@prisma/client';
import { AlertCircle } from 'lucide-react';

// Este tipo pode ser expandido conforme necessário
type LowStockItem = Pick<CatalogoItem, 'id' | 'nome' | 'unidade' | 'nivelMinimo'> & {
  quantidadeAtual: number;
};

export default function LowStockList({ items }: { items: LowStockItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">🎉 Nenhum item com estoque baixo. Tudo em ordem!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-100 dark:bg-gray-900">
      <h3 className="p-4 text-lg font-medium text-text">Itens com Estoque Baixo</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div>
                    <p className="font-medium text-text">{item.nome}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nível Mínimo: {String(item.nivelMinimo)} {item.unidade}</p>
                </div>
            </div>
            <p className="font-semibold text-red-500">
              {item.quantidadeAtual} {item.unidade}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
