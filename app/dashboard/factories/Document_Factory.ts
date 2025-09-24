import { id } from 'zod/v4/locales';
import { Documento, Tipos_Documentos } from '../../lib/documento';




const Titulos_Por_Tipo: Record<Tipos_Documentos, string> = {
    contrato: 'Contrato de Prestação de Serviços',
    orçamento: 'Orçamento da Obra',
    certidão: 'Certidão de Regularidade',
    relatórios: 'Relatório de Progresso da Obra',
};

let id_contador = 1;

export class Document_Factory {
    static criar(tipo: any, arg1: Date, conteudo: any, autor: any, anexos: any) {
        throw new Error('Method not implemented.');
    }
    static criarDocumento(tipo: Tipos_Documentos, data_emissão: Date, conteudo: string, autor: string, anexos?: File[]) : Documento{
        return {
            id: id_contador++,
            tipo,
            titulo_documento: Titulos_Por_Tipo[tipo],
            data_emissão,
            conteudo,
            autor,
            anexos,
        };
    }
}

