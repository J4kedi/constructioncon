// ATENÇÃO: Este arquivo contém dados mock para popular o banco de dados.
import {
  UserRole,
  StatusObra,
  StatusEtapa,
  CategoriaDespesa,
  UnidadeMedida,
  DocumentType,
  Company,
  User,
  Obra,
  Etapa,
  Address,
  Supplier,
  Despesa,
  Receita,
  Estoque,
  Document,
  WorkLog
} from '@prisma/client';

import { Decimal } from '@prisma/client/runtime/library';

// --- Tipos para o Seed: Omitimos campos que o DB gera automaticamente ---
type CompanySeed = Omit<Company, 'createdAt' | 'updatedAt'>;
type UserSeed = Omit<User, 'createdAt' | 'updatedAt'>;
type ObraSeed = Omit<Obra, 'createdAt' | 'updatedAt'>;
type EtapaSeed = Omit<Etapa, 'createdAt' | 'updatedAt'>;

export const companys: CompanySeed[] = [
  {
    id: 'cmevokh740001356oqodb4idq',
    name: 'Amazônia Engenharia e Construções',
    cnpj: '11.222.333/0001-44',
    logoUrl: '/logos/amazonia-eng.png',
    phone: '(92) 99999-0101',
    isActive: true,
  },
  {
    id: 'cmevoo9cz0003356o0i6s3hwi',
    name: 'Paraná Prime Construtora',
    cnpj: '22.333.444/0001-55',
    logoUrl: '/logos/parana-prime.png',
    phone: '(41) 98888-0202',
    isActive: true,
  },
  {
    id: 'cmevoodv90005356o2p7oc6yn',
    name: 'Sul Forte Empreendimentos',
    cnpj: '33.444.555/0001-66',
    logoUrl: '/logos/sul-forte.png',
    phone: '(48) 97777-0303',
    isActive: true,
  },
];

export const users: UserSeed[] = [
  // SUPER_ADMIN
  {
    id: 'cmevoish30000356ok0uezrvb',
    name: 'Kauan Pardini Augusto',
    email: 'kauan@constructioncon.com',
    password: '123456',
    role: UserRole.SUPER_ADMIN,
    jobTitle: 'Software Engineer',
    phone: '(11) 91111-1111',
    avatarUrl: '/avatars/kauan.png',
    isActive: true,
    companyId: companys[1].id,
  },
  // COMPANY_ADMIN da Amazônia Engenharia
  {
    id: 'cmevopcs50009356o2pjfzxlo',
    name: 'Mario Fernando Knaipp',
    email: 'mario@amazoniaeng.com',
    password: '123456',
    role: UserRole.COMPANY_ADMIN,
    jobTitle: 'Gerente de Projetos',
    phone: '(92) 92222-2222',
    avatarUrl: '/avatars/mario.png',
    isActive: true,
    companyId: companys[0].id,
  },
  // USER da Paraná Prime
  {
    id: 'cmevopj52000b356o6b82a7bn',
    name: 'Eduardo Henrique Camacho',
    email: 'eduardo@paranaprime.com',
    password: '123456',
    role: UserRole.USER,
    jobTitle: 'Engenheiro Civil',
    phone: '(41) 93333-3333',
    avatarUrl: '/avatars/eduardo.png',
    isActive: true,
    companyId: companys[1].id,
  },
  // END_CUSTOMER (cliente final)
  {
    id: 'cmevopojl000d356o9yqaiwgr',
    name: 'Caue Souza',
    email: 'caue.cliente@email.com',
    password: '123456',
    role: UserRole.END_CUSTOMER,
    jobTitle: null,
    phone: '(48) 94444-4444',
    avatarUrl: '/avatars/caue.png',
    isActive: true,
    companyId: companys[2].id,
  },
];

export const suppliers: Supplier[] = [
  {
    id: 'clw1f2g3h0001m8igabcd1234',
    name: 'Cimento Forte S.A.',
    cnpj: '44.555.666/0001-77',
    phone: '(11) 4004-1000',
    email: 'vendas@cimentoforte.com',
  },
  {
    id: 'clw1f2g3h0002m8igefgh5678',
    name: 'Madeireira Pinheiro',
    cnpj: '55.666.777/0001-88',
    phone: '(41) 3344-5566',
    email: 'contato@madeireirapinheiro.com.br',
  },
];

export const addresses: Omit<Address, 'id'>[] = [
  {
    street: 'Rua da Inovação',
    number: '123',
    neighborhood: 'Tecnoparque',
    city: 'Curitiba',
    state: 'PR',
    zipCode: '81234-567',
    isPrimary: true,
    companyId: companys[1].id,
    supplierId: null,
    complement: 'Rua do Jorge'
  },
  {
    street: 'Avenida Industrial',
    number: '1000',
    neighborhood: 'Distrito Industrial',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    isPrimary: true,
    companyId: null,
    supplierId: suppliers[0].id,
    complement: 'Rua do Jorge'
  },
];

export const obras: ObraSeed[] = [
  {
    id: 'clw1f5k6l0005m8igpqrs7890',
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
  },
  {
    id: 'clw1f5k6l0006m8igtuv12345',
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
  },
  {
    id: 'clw1f5k6l0007m8igwxyz6789',
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
  },
];

export const etapas: EtapaSeed[] = [
  {
    id: 'clw1g8m9n0008m8igabcd5678',
    nome: 'Fundação e Estrutura',
    custoPrevisto: new Decimal(300000.00),
    dataInicioPrevista: new Date('2023-08-01T00:00:00.000Z'),
    dataFimPrevista: new Date('2024-02-01T00:00:00.000Z'),
    dataInicioReal: new Date('2023-08-05T00:00:00.000Z'),
    dataFimReal: new Date('2024-02-10T00:00:00.000Z'),
    status: StatusEtapa.CONCLUIDA,
    obraId: obras[1].id,
    responsibleId: users[2].id,
    progressPercentage: 1.0,
  },
];

export const despesas: Omit<Despesa, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    descricao: 'Compra de 500 sacos de cimento',
    valor: new Decimal(15000.00),
    categoria: CategoriaDespesa.MATERIAL,
    data: new Date(),
    invoiceUrl: '/invoices/inv-001.pdf',
    obraId: obras[1].id,
    approverId: users[2].id,
    supplierId: suppliers[0].id,
  },
];

export const receitas: Omit<Receita, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    descricao: 'Primeira parcela do pagamento - Família Silva',
    valor: new Decimal('250000.00'),
    data: new Date('2023-08-10T00:00:00.000Z'),
    obraId: obras[1].id,
  },
  {
    descricao: 'Segunda parcela do pagamento - Família Silva',
    valor: new Decimal('300000.00'),
    data: new Date('2024-02-15T00:00:00.000Z'),
    obraId: obras[1].id,
  },
];

export const estoque: Omit<Estoque, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    item: 'Saco de Cimento (50kg)',
    quantidade: new Decimal('250.00'),
    unidade: UnidadeMedida.UN,
    custoUnitario: new Decimal('30.00'),
    obraId: obras[1].id,
    supplierId: suppliers[0].id,
  },
  {
    item: 'Viga de Madeira Pinus (6m)',
    quantidade: new Decimal('50.00'),
    unidade: UnidadeMedida.UN,
    custoUnitario: new Decimal('85.00'),
    obraId: obras[1].id,
    supplierId: suppliers[1].id,
  },
];

export const documents: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Planta Baixa - Térreo',
    url: '/docs/residencial-araucaria/planta-terreo.pdf',
    type: DocumentType.PLANTA_BAIXA,
    uploadedAt: new Date('2023-07-20T00:00:00.000Z'),
    obraId: obras[1].id,
  },
  {
    name: 'Alvará de Construção',
    url: '/docs/residencial-araucaria/alvara.pdf',
    type: DocumentType.ALVARA,
    uploadedAt: new Date('2023-07-25T00:00:00.000Z'),
    obraId: obras[1].id,
  },
  {
    name: 'Nota Fiscal - Cimento Forte S.A.',
    url: '/invoices/inv-001.pdf', // Corresponde à despesa
    type: DocumentType.OUTRO,
    uploadedAt: new Date(),
    obraId: obras[1].id,
  },
];

export const workLogs: Omit<WorkLog, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    date: new Date('2024-02-11T00:00:00.000Z'),
    notes: 'Iniciada a montagem da alvenaria do primeiro pavimento. Equipe completa no local.',
    photos: ['/logs/photo1.jpg', '/logs/photo2.jpg'],
    obraId: obras[1].id,
    authorId: users[2].id, // Log feito por Eduardo
  },
  {
    date: new Date('2024-02-12T00:00:00.000Z'),
    notes: 'Continuação da alvenaria. Recebimento de material (tijolos) conforme planejado. Clima estável.',
    photos: ['/logs/photo3.jpg'],
    obraId: obras[1].id,
    authorId: users[2].id, // Log feito por Eduardo
  },
];