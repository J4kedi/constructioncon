'use client';

import { formatCurrency, formatDate } from '@/app/lib/utils';

interface CashFlowData {
  date: string;
  entradas: number;
  saidas: number;
  saldoProjetado: number;
}

export function CashFlowTable({ data }: { data: CashFlowData[] }) {
  const headers = ['Data', 'Entradas', 'Saídas', 'Saldo Projetado'];

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-text">
        <thead className="text-left text-sm font-normal">
          <tr>
            {headers.map((header, index) => (
              <th scope="col" key={index} className={`px-4 py-3 font-medium ${index === 0 ? 'sm:pl-6' : ''}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-background">
          {data.map((item) => (
            <tr key={item.date} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
              <td className="whitespace-nowrap px-4 py-3 sm:pl-6">{formatDate(item.date, 'dd/MM/yyyy')}</td>
              <td className="whitespace-nowrap px-4 py-3 text-success">{formatCurrency(item.entradas)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-destructive">{formatCurrency(item.saidas)}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium">{formatCurrency(item.saldoProjetado)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
