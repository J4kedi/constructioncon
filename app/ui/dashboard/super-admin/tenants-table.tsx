'use client';

import { useState, useTransition } from 'react';
import type { Tenant } from '@prisma/client';
import { deprovisionTenantAction } from '@/app/actions/scripts.actions';
import Modal from '@/app/ui/components/Modal';
import { Terminal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Table from '@/app/ui/components/Table';

export default function TenantsTable({ tenants }: { tenants: Tenant[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [output, setOutput] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const openConfirmationModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
    setOutput('');
    setError(false);
    setConfirmationInput('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTenant(null);
  };

  const handleDeprovision = () => {
    if (!selectedTenant || confirmationInput !== selectedTenant.subdomain) return;

    startTransition(async () => {
      const result = await deprovisionTenantAction(selectedTenant.subdomain);
      setOutput(result.output);
      setError(!result.success);
      if (result.success) {
        router.refresh();
        setTimeout(() => closeModal(), 3000);
      }
    });
  };

  const headers = ['Nome da Empresa', 'Subdomínio', 'Schema', 'Data de Criação'];

  const renderRow = (tenant: Tenant) => (
    <tr key={tenant.id} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
      <td className="whitespace-nowrap py-3 pl-6 pr-3">{tenant.name}</td>
      <td className="whitespace-nowrap px-3 py-3">{tenant.subdomain}</td>
      <td className="whitespace-nowrap px-3 py-3">{tenant.schemaName}</td>
      <td className="whitespace-nowrap px-3 py-3">{new Date(tenant.createdAt).toLocaleDateString('pt-BR')}</td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <button onClick={() => openConfirmationModal(tenant)} className="text-red-500 hover:text-red-700">
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Table headers={headers} data={tenants} renderRow={renderRow} hasActions={true} />

      {selectedTenant && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={`Remover Tenant: ${selectedTenant.name}`}>
            <div className="space-y-4">
                <p className='text-sm text-red-500'>Esta ação é irreversível. Todos os dados associados ao tenant <span className='font-bold'>{selectedTenant.name}</span> serão permanentemente excluídos.</p>
                <p className='text-sm text-text/80'>Para confirmar, digite o subdomínio <span className='font-bold'>{selectedTenant.subdomain}</span> no campo abaixo.</p>
                <div>
                    <input
                        type="text"
                        value={confirmationInput}
                        onChange={(e) => setConfirmationInput(e.target.value)}
                        className="w-full p-2 rounded-md bg-secondary/20 border-red-500/50 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md text-text/80 hover:bg-secondary/10">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleDeprovision}
                        disabled={isPending || confirmationInput !== selectedTenant.subdomain}
                        className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Removendo...' : 'Eu entendo, remover tenant'}
                    </button>
                </div>
            </div>
            {output && (
                <div className="mt-4 p-4 bg-black rounded-md font-mono text-sm text-white overflow-x-auto">
                    <div className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-2">
                        <Terminal size={16} />
                        <span className="font-semibold">Saída do Terminal</span>
                    </div>
                    <pre className={`whitespace-pre-wrap ${error ? 'text-red-400' : 'text-green-400'}`}>
                        {output}
                    </pre>
                </div>
            )}
        </Modal>
      )}
    </>
  );
}
