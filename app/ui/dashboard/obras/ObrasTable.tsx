'use client';

import { Pencil } from 'lucide-react';
import Table from '@/app/ui/components/Table';
import Modal from '@/app/ui/components/Modal';
import EditObraForm from './EditObraForm';
import { PlainObra } from '@/app/lib/definitions';
import StatusSelect from './StatusSelect';
import { DeleteObra } from './DeleteObra';
import { useTableState } from '@/app/lib/hooks/useTableState';

type ObrasTableProps = {
    obras: PlainObra[];
};

export default function ObrasTable({ obras: initialObras }: ObrasTableProps) {
    const { items: obras, modalState, handleDelete } = useTableState<PlainObra>(initialObras);

    const headers = ['Nome da Obra', 'Tipo', 'Cliente', 'Status', 'Data de Início', 'Orçamento'];

    const renderRow = (obra: PlainObra) => (
        <tr key={obra.id} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <p className="font-semibold">{obra.nome}</p>
            </td>
            <td className="whitespace-nowrap px-3 py-3">
                {obra.type}
            </td>
            <td className="whitespace-nowrap px-3 py-3">
                {obra.endCustomerName}
            </td>
            <td className="whitespace-nowrap px-3 py-3">
                <StatusSelect obraId={obra.id} currentStatus={obra.status} />
            </td>
            <td className="whitespace-nowrap px-4 py-3">
                {obra.dataInicio} 
            </td>
            <td className="whitespace-nowrap px-4 py-3">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obra.orcamentoTotal)}
            </td>
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                    <button onClick={() => modalState.openModal(obra)} className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer">
                        <Pencil className="w-4" />
                    </button>
                    <DeleteObra id={obra.id} onSuccess={() => handleDelete(obra.id)} />
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <Table headers={headers} data={obras} renderRow={renderRow} hasActions={true} />
            {modalState.selectedItem && (
                <Modal isOpen={modalState.isOpen} onClose={modalState.closeModal} title={`Editar Obra: ${modalState.selectedItem.nome}`}>
                    <EditObraForm obra={modalState.selectedItem} onClose={modalState.closeModal} />
                </Modal>
            )}
        </>
    );
}