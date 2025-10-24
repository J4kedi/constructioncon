'use client';

import Table from '@/app/ui/components/Table';

import { formatCurrency } from '@/app/lib/utils';

import { StatusBadge } from '@/app/ui/components/BadgeFactory';

import { EstoqueItem } from '@/app/lib/definitions';



interface EstoqueTableProps {

  items: (EstoqueItem & { valorTotal: number })[];

}



export default function EstoqueTable({ items }: EstoqueTableProps) {

  const headers = ['Item', 'Categoria', 'Custo Unitário', 'Qtd. Atual', 'Nível Mínimo', 'Valor Total', 'Status'];



  const renderCells = (item: EstoqueItem & { valorTotal: number }): React.ReactNode[] => {

    return [

      <span className="font-medium">{item.nome}</span>,

      item.categoria || 'N/A',

      formatCurrency(item.custoUnitario),

      `${item.quantidadeAtual} ${item.unidade}`,

      `${item.nivelMinimo} ${item.unidade}`,

      <span className="font-medium">{formatCurrency(item.valorTotal)}</span>,

      <StatusBadge type="stockLevel" value={{ quantity: item.quantidadeAtual, minLevel: item.nivelMinimo }} />

    ];

  }



  if (items.length === 0) {

    return <p className="text-center text-text/70 mt-4">Nenhum item encontrado no catálogo.</p>;

  }



  return <Table headers={headers} data={items} renderCells={renderCells} hasActions={false} />;

}
