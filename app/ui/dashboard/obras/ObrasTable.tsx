'use client';

import { StatusObra } from '@prisma/client';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

export type PlainObra = {
    id: string;
    nome: string;
    endCustomerName: string;
    status: StatusObra;
    dataInicio: string;
};

type StatusBadgeProps = {
    status: StatusObra;
};

function StatusBadge({ status }: StatusBadgeProps) {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full capitalize tracking-wider";
    const statusStyles = {
        PLANEJAMENTO: "bg-blue-500/20 text-blue-400",
        EM_ANDAMENTO: "bg-yellow-500/20 text-yellow-400",
        CONCLUIDA: "bg-green-500/20 text-green-400",
        PAUSADA: "bg-gray-500/20 text-gray-400",
        CANCELADA: "bg-red-500/20 text-red-400",
    };

    const fallbackStyle = "bg-gray-500/20 text-gray-400";

    return (
        <span className={`${baseClasses} ${statusStyles[status] || fallbackStyle}`}>
            {status.replace('_', ' ').toLowerCase()}
        </span>
    );
}

type ObrasTableProps = {
    obras: PlainObra[];
};

export default function ObrasTable({ obras }: ObrasTableProps) {
    return (
        <div className="w-full">
            <div className="flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg bg-secondary/20 p-2 md:pt-0">
                            <table className="min-w-full text-text">
                                <thead className="rounded-lg text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome da Obra</th>
                                        <th scope="col" className="px-3 py-5 font-medium">Cliente</th>
                                        <th scope="col" className="px-3 py-5 font-medium">Status</th>
                                        <th scope="col" className="px-3 py-5 font-medium">Data de Início</th>
                                        <th scope="col" className="relative py-3 pl-6 pr-3">
                                            <span className="sr-only">Ações</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-background">
                                    {obras.map((obra) => (
                                        <tr key={obra.id} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
                                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                                <p className="font-semibold">{obra.nome}</p>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {obra.endCustomerName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                <StatusBadge status={obra.status} />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {obra.dataInicio} 
                                            </td>
                                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                                <div className="flex justify-end gap-3">
                                                    <Link href={`/dashboard/obras/${obra.id}/edit`} className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer">
                                                        <Pencil className="w-4" />
                                                    </Link>
                                                </div>
                                            </td>
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
