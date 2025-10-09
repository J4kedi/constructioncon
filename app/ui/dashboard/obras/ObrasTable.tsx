'use client';

import { useState } from 'react';
import { StatusObra } from '@prisma/client';
import { Pencil } from 'lucide-react';
import Table from '@/app/ui/components/Table';
import Modal from '@/app/ui/components/Modal';
import EditObraForm from './EditObraForm';
import { getObraDetailsAction } from '@/app/actions/obra.actions';
import { PlainObra } from '@/app/lib/definitions';
import StatusSelect from './StatusSelect'; // Importar o novo componente

type FullObraForForm = PlainObra | null;

type ObrasTableProps = {
    obras: PlainObra[];
};

export default function ObrasTable({ obras }: ObrasTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedObra, setSelectedObra] = useState<FullObraForForm | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEditClick = async (obraId: string) => {
        setIsLoading(true);
        try {
            const obraDetails = await getObraDetailsAction(obraId);
            setSelectedObra(obraDetails);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch obra details:", error);
            alert("Não foi possível carregar os dados da obra.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedObra(null);
    };

    const headers = ['Nome da Obra', 'Tipo', 'Cliente', 'Status', 'Data de Início'];

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
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                    <button onClick={() => handleEditClick(obra.id)} className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer" disabled={isLoading}>
                        <Pencil className="w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <>
            <Table headers={headers} data={obras} renderRow={renderRow} hasActions={true} />
            {selectedObra && (
                <Modal isOpen={isModalOpen} onClose={closeModal} title={`Editar Obra: ${selectedObra.nome}`}>
                    <EditObraForm obra={selectedObra} />
                </Modal>
            )}
        </>
    );
}