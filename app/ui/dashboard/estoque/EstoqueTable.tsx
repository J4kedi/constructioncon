'use client';

import Table from '@/app/ui/components/Table';
import { formatCurrency } from '@/app/lib/utils';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';
import { EstoqueItem } from '@/app/lib/definitions';

interface EstoqueTableProps {
  items: EstoqueItem[];
}

export default function EstoqueTable({ items }: EstoqueTableProps) {
  const headers = ['Item', 'Categoria', 'Custo Unitário', 'Qtd. Atual', 'Nível Mínimo', 'Valor Total', 'Status'];

  const renderRow = (item: EstoqueItem) => {
    const valorTotal = item.custoUnitario * item.quantidadeAtual;

    return (
      <tr key={item.id} className="w-full border-b border-secondary/20 text-sm">
        <td className="whitespace-nowrap py-3 pl-6 pr-3 font-medium">
          {item.nome}
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          {item.categoria || 'N/A'}
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          {formatCurrency(item.custoUnitario)}
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          {item.quantidadeAtual} {item.unidade}
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          {item.nivelMinimo} {item.unidade}
        </td>
        <td className="whitespace-nowrap px-3 py-3 font-medium">
          {formatCurrency(valorTotal)}
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          <StatusBadge type="stockLevel" value={{ quantity: item.quantidadeAtual, minLevel: item.nivelMinimo }} />
        </td>
      </tr>
    );
  }

  if (items.length === 0) {
    return <p className="text-center text-text/70 mt-4">Nenhum item encontrado no catálogo.</p>;
  }

  return <Table headers={headers} data={items} renderRow={renderRow} />;
}
