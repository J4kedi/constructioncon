'use client';

import { useState, useTransition } from 'react';
import { provisionTenantAction } from '@/app/actions/scripts.actions';
import Modal from '@/app/ui/components/Modal';
import { Terminal } from 'lucide-react';

export default function ProvisionTenantForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [output, setOutput] = useState('');
  const [error, setError] = useState(false);

  const openModal = () => {
    setOutput('');
    setError(false);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await provisionTenantAction(formData);
      setOutput(result.output);
      setError(!result.success);
      if (result.success) {
        // Optionally close modal on success after a delay, or user can close manually
        // setTimeout(() => closeModal(), 3000);
      }
    });
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md"
      >
        Adicionar Novo Tenant
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Provisionar Novo Tenant">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text/80 mb-1">
              Nome da Empresa
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-2 rounded-md bg-secondary/20 border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="subdomain" className="block text-sm font-medium text-text/80 mb-1">
              Subdomínio
            </label>
            <input
              type="text"
              id="subdomain"
              name="subdomain"
              required
              className="w-full p-2 rounded-md bg-secondary/20 border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <p className="text-xs text-text/60 mt-1">Apenas letras minúsculas, números e hífens. Ex: minha-empresa</p>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md text-text/80 hover:bg-secondary/10">
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-md bg-primary text-white font-semibold disabled:bg-gray-500"
            >
              {isPending ? 'Provisionando...' : 'Provisionar'}
            </button>
          </div>
        </form>
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
    </div>
  );
}