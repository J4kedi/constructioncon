import { 
  UserRole,
  StatusObra,
  StatusEtapa,
  CategoriaDespesa,
  UnidadeMedida,
  DocumentType,
  TipoMovimento,
  StatusContaPagar,
  StatusContaReceber
} from '@prisma/client';
import type {
  Company,
  User,
  Obra,
  Etapa,
  Address,
  Supplier,
  ContaPagar,
  ContaReceber,
  CatalogoItem,
  EstoqueMovimento,
  Document,
  WorkLog
} from '@prisma/client';

import { Decimal } from '@prisma/client/runtime/library';

// --- Tipos para o Seed: Agora incluímos o ID para ter referências estáveis ---
type CompanySeed = Omit<Company, 'createdAt' | 'updatedAt'>;
type UserSeed = Omit<User, 'createdAt' | 'updatedAt'>;
type ObraSeed = Omit<Obra, 'createdAt' | 'updatedAt'>;
type EtapaSeed = Omit<Etapa, 'progressPercentage'>;
type CatalogoItemSeed = Omit<CatalogoItem, 'createdAt' | 'updatedAt'>;
type EstoqueMovimentoSeed = Omit<EstoqueMovimento, 'data'>;
type ContaPagarSeed = Omit<ContaPagar, 'dataEmissao'>;
type ContaReceberSeed = Omit<ContaReceber, 'dataEmissao'>;
type DocumentSeed = Omit<Document, 'uploadedAt'>;

export const companys: CompanySeed[] = [
  {
    id: 'comp-amazonia',
    name: 'Amazônia Engenharia e Construções',
    cnpj: '11.222.333/0001-44',
    logoUrl: '/logos/amazonia-eng.png',
    phone: '(92) 99999-0101',
    isActive: true,
  },
  {
    id: 'comp-parana',
    name: 'Paraná Prime Construtora',
    cnpj: '22.333.444/0001-55',
    logoUrl: '/logos/parana-prime.png',
    phone: '(41) 98888-0202',
    isActive: true,
  },
  {
    id: 'comp-sul',
    name: 'Sul Forte Empreendimentos',
    cnpj: '33.444.555/0001-66',
    logoUrl: '/logos/sul-forte.png',
    phone: '(48) 97777-0303',
    isActive: true,
  },
];

export const users: UserSeed[] = [
  {
    id: 'user-kauan',
    name: 'Kauan Pardini Augusto',
    email: 'kauan@constructioncon.com',
    password: 'Qwe123@@',
    role: UserRole.SUPER_ADMIN,
    jobTitle: 'Software Engineer',
    phone: '(11) 91111-1111',
    avatarUrl: '/avatar-placeholder.svg',
    isActive: true,
    companyId: companys[1].id,
  },
  {
    id: 'user-mario',
    name: 'Mario Fernando Knaipp',
    email: 'mario@amazoniaeng.com',
    password: 'Qwe123@@',
    role: UserRole.COMPANY_ADMIN,
    jobTitle: 'Gerente de Projetos',
    phone: '(92) 92222-2222',
    avatarUrl: '/avatar-placeholder.svg',
    isActive: true,
    companyId: companys[0].id,
  },
  {
    id: 'user-eduardo',
    name: 'Eduardo Henrique Camacho',
    email: 'eduardo@paranaprime.com',
    password: 'Qwe123@@',
    role: UserRole.USER,
    jobTitle: 'Engenheiro Civil',
    phone: '(41) 93333-3333',
    avatarUrl: '/avatar-placeholder.svg',
    isActive: true,
    companyId: companys[1].id,
  },
  {
    id: 'user-caue',
    name: 'Caue Souza',
    email: 'caue.cliente@email.com',
    password: 'Qwe123@@',
    role: UserRole.END_CUSTOMER,
    jobTitle: null,
    phone: '(48) 94444-4444',
    avatarUrl: '/avatar-placeholder.svg',
    isActive: true,
    companyId: companys[2].id,
  },
];

export const suppliers: Supplier[] = [
  {
    id: 'supp-cimento',
    name: 'Cimento Forte S.A.',
    cnpj: '44.555.666/0001-77',
    phone: '(11) 4004-1000',
    email: 'vendas@cimentoforte.com',
  },
  {
    id: 'supp-madeira',
    name: 'Madeireira Pinheiro',
    cnpj: '55.666.777/0001-88',
    phone: '(41) 3344-5566',
    email: 'contato@madeireirapinheiro.com.br',
  },
];

export const addresses: Address[] = [
  {
    id: 'addr-parana',
    street: 'Rua da Inovação',
    number: '123',
    complement: 'Bloco A',
    neighborhood: 'Tecnoparque',
    city: 'Curitiba',
    state: 'PR',
    zipCode: '81234-567',
    isPrimary: true,
    companyId: companys[1].id,
    supplierId: null,
  },
  {
    id: 'addr-cimento',
    street: 'Avenida Industrial',
    number: '1000',
    complement: null,
    neighborhood: 'Distrito Industrial',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    isPrimary: true,
    companyId: null,
    supplierId: suppliers[0].id,
  },
];

export const obras: ObraSeed[] = [
  {
    id: 'obra-sky-tower',
    nome: 'Edifício Sky Tower',
    address: 'Av. das Torres, 100, Manaus - AM',
    endCustomerName: 'Investidores Anônimos',
    orcamentoTotal: new Decimal(1500000.00),
    currentCost: new Decimal(900000.00),
    progressPercentage: 25.0,
    dataInicio: new Date('2024-01-15T00:00:00.000Z'),
    dataPrevistaFim: new Date('2026-01-15T00:00:00.000Z'),
    status: StatusObra.EM_ANDAMENTO,
    companyId: companys[0].id,
    endCustomerId: null,
    type: 'RESIDENCIAL'
  },
  {
    id: 'obra-araucaria',
    nome: 'Residencial Araucária',
    address: 'Rua das Araucárias, 500, Curitiba - PR',
    endCustomerName: 'Família Silva',
    orcamentoTotal: new Decimal(1500000.00),
    currentCost: new Decimal(900000.00),
    progressPercentage: 60.0,
    dataInicio: new Date('2023-08-01T00:00:00.000Z'),
    dataPrevistaFim: new Date('2025-10-31T00:00:00.000Z'),
    status: StatusObra.EM_ANDAMENTO,
    companyId: companys[1].id,
    endCustomerId: null,
    type: 'RESIDENCIAL'
  },
  {
    id: 'obra-praia',
    nome: 'Casa de Praia - Caue Souza',
    address: 'Av. Beira Mar, 2024, Florianópolis - SC',
    endCustomerName: 'Caue Souza',
    orcamentoTotal: new Decimal(850000.00),
    currentCost: new Decimal(50000.00),
    progressPercentage: 5.0,
    dataInicio: new Date('2025-07-20T00:00:00.000Z'),
    dataPrevistaFim: new Date('2026-05-20T00:00:00.000Z'),
    status: StatusObra.PLANEJAMENTO,
    companyId: companys[2].id,
    endCustomerId: users[3].id,
    type: 'RESIDENCIAL'
  },
];

export const etapas: EtapaSeed[] = [
  {
    id: 'etapa-fundacao-araucaria',
    nome: 'Fundação e Estrutura',
    custoPrevisto: new Decimal(300000.00),
    dataInicioPrevista: new Date('2023-08-01T00:00:00.000Z'),
    dataFimPrevista: new Date('2024-02-01T00:00:00.000Z'),
    dataInicioReal: new Date('2023-08-05T00:00:00.000Z'),
    dataFimReal: new Date('2024-02-10T00:00:00.000Z'),
    status: StatusEtapa.CONCLUIDA,
    obraId: obras[1].id,
    responsibleId: users[2].id,
  },
];

export const contasPagar: ContaPagarSeed[] = [
  {
    id: 'desp-cimento-araucaria',
    fornecedor: 'Cimento Forte S.A.',
    valor: new Decimal(15000.00),
    categoria: CategoriaDespesa.MATERIAL,
    dataVencimento: new Date('2024-03-15T00:00:00.000Z'),
    anexoUrl: '/invoices/inv-001.pdf',
    status: StatusContaPagar.PAGO,
    obraId: obras[1].id,
    approverId: users[2].id,
    supplierId: suppliers[0].id,
  },
];

export const contasReceber: ContaReceberSeed[] = [
  {
    id: 'rec-parcela1-araucaria',
    cliente: 'Família Silva',
    descricao: 'Primeira parcela do pagamento',
    valor: new Decimal('250000.00'),
    dataVencimento: new Date('2023-09-01T00:00:00.000Z'),
    status: StatusContaReceber.RECEBIDO,
    obraId: obras[1].id,
  },
];

export const catalogoItens: CatalogoItemSeed[] = [
  {
    id: 'cat-cimento-50kg',
    nome: 'Cimento Portland CP II 50kg',
    descricao: 'Cimento para uso geral em construções.',
    unidade: UnidadeMedida.UN,
    categoria: 'Materiais Básicos',
    custoUnitario: new Decimal(35.50),
    nivelMinimo: new Decimal(50),
    companyId: companys[0].id, // Amazônia
  },
  {
    id: 'cat-vergalhao-10mm',
    nome: 'Vergalhão de Aço CA-50 10mm',
    descricao: 'Barra de 12 metros.',
    unidade: UnidadeMedida.UN,
    categoria: 'Aço',
    custoUnitario: new Decimal(52.00),
    nivelMinimo: new Decimal(100),
    companyId: companys[0].id, // Amazônia
  },
  {
    id: 'cat-tijolo-9f',
    nome: 'Tijolo Baiano 9 Furos (Milheiro)',
    descricao: 'Tijolos cerâmicos para alvenaria.',
    unidade: UnidadeMedida.UN,
    categoria: 'Alvenaria',
    custoUnitario: new Decimal(850.00),
    nivelMinimo: new Decimal(5),
    companyId: companys[1].id, // Paraná
  },
];

export const estoqueMovimentos: EstoqueMovimentoSeed[] = [
  {
    id: 'mov-001',
    catalogoItemId: catalogoItens[0].id, // Cimento
    quantidade: new Decimal(200),
    tipo: TipoMovimento.ENTRADA,
    obraDestinoId: null,
    usuarioId: users[1].id,
    supplierId: suppliers[0].id,
  },
  {
    id: 'mov-002',
    catalogoItemId: catalogoItens[1].id, // Vergalhão
    quantidade: new Decimal(500),
    tipo: TipoMovimento.ENTRADA,
    obraDestinoId: null,
    usuarioId: users[1].id,
    supplierId: suppliers[0].id,
  },
  {
    id: 'mov-003',
    catalogoItemId: catalogoItens[0].id, // Cimento
    quantidade: new Decimal(-50),
    tipo: TipoMovimento.SAIDA,
    obraDestinoId: obras[0].id, // Edifício Sky Tower
    usuarioId: users[1].id,
    supplierId: null,
  },
  {
    id: 'mov-004',
    catalogoItemId: catalogoItens[2].id, // Tijolo
    quantidade: new Decimal(20),
    tipo: TipoMovimento.ENTRADA,
    obraDestinoId: null,
    usuarioId: users[2].id,
    supplierId: suppliers[1].id,
  },
  {
    id: 'mov-005',
    catalogoItemId: catalogoItens[2].id, // Tijolo
    quantidade: new Decimal(-10),
    tipo: TipoMovimento.SAIDA,
    obraDestinoId: obras[1].id, // Residencial Araucária
    usuarioId: users[2].id,
    supplierId: null,
  },
];

export const documents: DocumentSeed[] = [
  {
    id: 'doc-planta-araucaria',
    name: 'Planta Baixa - Térreo',
    url: '/docs/residencial-araucaria/planta-terreo.pdf',
    type: DocumentType.PLANTA_BAIXA,
    obraId: obras[1].id,
  },
];

export const workLogs: Omit<WorkLog, 'id'>[] = [
  {
    date: new Date('2024-02-11T00:00:00.000Z'),
    notes: 'Iniciada a montagem da alvenaria do primeiro pavimento.',
    photos: ['/logs/photo1.jpg'],
    obraId: obras[1].id,
    authorId: users[2].id,
  },
];