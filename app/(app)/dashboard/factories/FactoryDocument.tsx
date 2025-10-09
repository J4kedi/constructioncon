'use client';

import { useState } from 'react';
import { Documento, Tipos_Documentos } from '../../lib/documento';
import { Document_Factory } from '../factories/Document_Factory';


export default function FactoryDocument() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [tipo, setTipo] = useState<Tipos_Documentos>('contrato');
  const [dataEmissao, setDataEmissao] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('');
  const [anexos, setAnexos] = useState<FileList | null>(null);

  const handleAnexosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAnexos(e.target.files);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const listaDeAnexos = anexos ? Array.from(anexos) : undefined;
    
    const dataCorrigida = new Date(`${dataEmissao}T00:00:00`);

    const novoDocumento = Document_Factory.criarDocumento(
      tipo,
      dataCorrigida,
      conteudo,
      autor,
      listaDeAnexos
    );

    setDocumentos([...documentos, novoDocumento]);

    setTipo('contrato');
    setDataEmissao('');
    setConteudo('');
    setAutor('');
    setAnexos(null); 
    e.currentTarget.reset();
  };

  const handleDelete = (id: number) => {
    setDocumentos(documentos.filter(doc => doc.id !== id));
  };

return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerador de Documentos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as Tipos_Documentos)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="contrato">Contrato</option>
                <option value="orçamento">Orçamento</option>
                <option value="certidão">Certidão</option>
                <option value="relatórios">Relatórios</option>
              </select>
            </div>
            <div>
              <label htmlFor="dataEmissao" className="block text-sm font-medium text-gray-700">Data de Emissão</label>
              <input
                type="date"
                id="dataEmissao"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700">Conteúdo</label>
              <textarea
                id="conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="autor" className="block text-sm font-medium text-gray-700">Autor</label>
              <input
                type="text"
                id="autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
           <div>
              <label htmlFor="anexos" className="block text-sm font-medium text-gray-700">Anexos</label>
              <input
                type="file"
                id="anexos"
                multiple
                onChange={handleAnexosChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Criar Documento
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Documentos Criados</h2>
          <div className="space-y-4">
            {documentos.map((doc) => (
              <div key={doc.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">{doc.titulo_documento}</h3>
                <p className="text-sm text-gray-600">ID: {doc.id}</p>
                <p className="text-sm text-gray-600">Tipo: {doc.tipo}</p>
                <p className="text-sm text-gray-600">Data de Emissão: {new Date(doc.data_emissão).toLocaleDateString()}</p>
                <p className="mt-2">{doc.conteudo}</p>
                <p className="text-sm font-medium mt-2">Autor: {doc.autor}</p>
                {doc.anexos && doc.anexos.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-800">Anexos:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {doc.anexos.map((anexo, index) => (
                          <li key={index} className="text-sm">
                            {anexo.name} ({Math.round(anexo.size / 1024)} KB)
                          </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {documentos.length === 0 && (
              <p className="text-gray-500">Nenhum documento criado ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};