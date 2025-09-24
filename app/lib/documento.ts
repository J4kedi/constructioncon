export type Tipos_Documentos = 'contrato' | 'orçamento' | 'certidão' | 'relatórios';

export interface Documento {
    id: number;
    tipo: Tipos_Documentos;
    titulo_documento: string;
    data_emissão: Date;
    conteudo: string;
    autor: string;
    anexos?: File[];
}