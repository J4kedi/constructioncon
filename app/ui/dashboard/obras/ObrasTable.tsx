'use client';

import { StatusObra } from '@prisma/client';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import Table from '@/app/ui/components/Table';
import Badge, { type BadgeVariant } from '@/app/ui/components/Badge';

export type PlainObra = {
    id: string;
    nome: string;
    endCustomerName: string;
    status: StatusObra;
    dataInicio: string;
};

type ObrasTableProps = {
    obras: PlainObra[];
};

const statusVariantMap: Record<StatusObra, BadgeVariant> = {
    PLANEJAMENTO: 'primary',
    EM_ANDAMENTO: 'warning',
    CONCLUIDA: 'success',
    PAUSADA: 'neutral',
    CANCELADA: 'danger',
};

export default function ObrasTable({ obras }: ObrasTableProps) {
    const headers = ['Nome da Obra', 'Cliente', 'Status', 'Data de Início'];

    const renderRow = (obra: PlainObra) => (
        <tr key={obra.id} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <p className="font-semibold">{obra.nome}</p>
            </td>
            <td className="whitespace-nowrap px-3 py-3">
                {obra.endCustomerName}
            </td>
            <td className="whitespace-nowrap px-3 py-3">
                <Badge 
                    text={obra.status.replace('_', ' ').toLowerCase()} 
                    variant={statusVariantMap[obra.status] || 'neutral'} 
                />
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
    );

    return <Table headers={headers} data={obras} renderRow={renderRow} hasActions={true} />;
}