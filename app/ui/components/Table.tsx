import React from 'react';

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderCells: (item: T) => React.ReactNode[];
  hasActions?: boolean;
}

export default function Table<T>({ headers, data, renderCells, hasActions = true }: TableProps<T>) {
  return (
    <div className="w-full">
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-secondary/20 p-2 md:pt-0">
              <table className="min-w-full text-text">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    {headers.map((header, index) => (
                      <th scope="col" key={index} className={`px-4 py-5 font-medium ${index === 0 ? 'sm:pl-6' : ''}`}>
                        {header}
                      </th>
                    ))}
                    {hasActions && (
                      <th scope="col" className="relative py-3 pl-6 pr-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-background">
                  {data.map((item, index) => (
                    <tr 
                      key={(item as any).id || index} 
                      className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      {renderCells(item).map((cell, cellIndex) => (
                        <td key={cellIndex} className="whitespace-nowrap px-3 py-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}