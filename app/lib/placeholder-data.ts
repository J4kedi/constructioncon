// ATENÇÃO: Este arquivo contém dados mock para popular o banco de dados.

export const companys = [
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

export const users = [
  // SUPER_ADMIN (não associado a uma company específica)
  {
    id: 'cmevoish30000356ok0uezrvb',
    name: 'Kauan Pardini Augusto',
    email: 'kauan@constructioncon.com',
    password: '123456',
    role: 'SUPER_ADMIN',
    jobTitle: 'Software Engineer',
    phone: '(11) 91111-1111',
    avatarUrl: '/avatars/kauan.png',
    isActive: true,
    companyId: companys[1].id, // Exemplo: SUPER_ADMIN pode pertencer a uma company interna
  },
  // COMPANY_ADMIN da Amazônia Engenharia
  {
    id: 'cmevopcs50009356o2pjfzxlo',
    name: 'Mario Fernando Knaipp',
    email: 'mario@amazoniaeng.com',
    password: '123456',
    role: 'COMPANY_ADMIN',
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
    role: 'USER',
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
    role: 'END_CUSTOMER',
    jobTitle: null,
    phone: '(48) 94444-4444',
    avatarUrl: '/avatars/caue.png',
    isActive: true,
    companyId: companys[2].id, // Cliente associado à empresa que está construindo para ele
  },
];

export const suppliers = [
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

export const addresses = [
  // Endereços da Paraná Prime
  {
    id: 'clw1f3i4j0003m8ighijk9012',
    street: 'Rua da Inovação',
    number: '123',
    neighborhood: 'Tecnoparque',
    city: 'Curitiba',
    state: 'PR',
    zipCode: '81234-567',
    isPrimary: true,
    companyId: companys[1].id,
  },
  // Endereço do Fornecedor Cimento Forte
  {
    id: 'clw1f3i4j0004m8iglmno3456',
    street: 'Avenida Industrial',
    number: '1000',
    neighborhood: 'Distrito Industrial',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    isPrimary: true,
    supplierId: suppliers[0].id,
  },
];

export const obras = [
  {
    id: 'clw1f5k6l0005m8igpqrs7890',
    nome: 'Edifício Sky Tower',
    address: 'Av. das Torres, 100, Manaus - AM',
    endCustomerName: 'Investidores Anônimos',
    orcamentoTotal: '5000000.00', // Usar string para Decimal
    currentCost: '1250000.00',
    progressPercentage: 25.0,
    dataInicio: new Date('2024-01-15T00:00:00.000Z'),
    dataPrevistaFim: new Date('2026-01-15T00:00:00.000Z'),
    status: 'EM_ANDAMENTO',
    companyId: companys[0].id, // Obra da Amazônia Engenharia
    endCustomerId: null,
  },
  {
    id: 'clw1f5k6l0006m8igtuv12345',
    nome: 'Residencial Araucária',
    address: 'Rua das Araucárias, 500, Curitiba - PR',
    endCustomerName: 'Família Silva',
    orcamentoTotal: '1500000.00',
    currentCost: '900000.00',
    progressPercentage: 60.0,
    dataInicio: new Date('2023-08-01T00:00:00.000Z'),
    dataPrevistaFim: new Date('2025-10-31T00:00:00.000Z'),
    status: 'EM_ANDAMENTO',
    companyId: companys[1].id, // Obra da Paraná Prime
    endCustomerId: null,
  },
  {
    id: 'clw1f5k6l0007m8igwxyz6789',
    nome: 'Casa de Praia - Caue Souza',
    address: 'Av. Beira Mar, 2024, Florianópolis - SC',
    endCustomerName: 'Caue Souza',
    orcamentoTotal: '850000.00',
    currentCost: '50000.00',
    progressPercentage: 5.0,
    dataInicio: new Date('2025-07-20T00:00:00.000Z'),
    dataPrevistaFim: new Date('2026-05-20T00:00:00.000Z'),
    status: 'PLANEJAMENTO',
    companyId: companys[2].id, // Obra da Sul Forte
    endCustomerId: users[3].id, // Vinculada ao usuário Caue Souza
  },
];

export const etapas = [
  // Etapas da Obra Residencial Araucária
  {
    id: 'clw1g8m9n0008m8igabcd5678',
    nome: 'Fundação e Estrutura',
    custoPrevisto: '300000.00',
    dataInicioPrevista: new Date('2023-08-01T00:00:00.000Z'),
    dataFimPrevista: new Date('2024-02-01T00:00:00.000Z'),
    dataInicioReal: new Date('2023-08-05T00:00:00.000Z'),
    dataFimReal: new Date('2024-02-10T00:00:00.000Z'),
    status: 'CONCLUIDA',
    obraId: obras[1].id,
    responsibleId: users[2].id, // Eduardo é o responsável
  },
  {
    id: 'clw1g8m9n0009m8igefgh9012',
    nome: 'Alvenaria e Lajes',
    custoPrevisto: '450000.00',
    dataInicioPrevista: new Date('2024-02-02T00:00:00.000Z'),
    dataFimPrevista: new Date('2024-08-02T00:00:00.000Z'),
    dataInicioReal: new Date('2024-02-11T00:00:00.000Z'),
    dataFimReal: null,
    status: 'EM_ANDAMENTO',
    obraId: obras[1].id,
    responsibleId: users[2].id,
  },
];

export const despesas = [
  {
    id: 'clw1h9o0p000am8igijkl3456',
    descricao: 'Compra de 500 sacos de cimento',
    valor: '15000.00',
    categoria: 'MATERIAL',
    data: new Date(),
    invoiceUrl: '/invoices/inv-001.pdf',
    obraId: obras[1].id, // Despesa da Obra Residencial Araucária
    approverId: users[1].id, // Aprovada por um admin da empresa
    supplierId: suppliers[0].id, // Fornecedor Cimento Forte
  },
];

export const receitas = [
  {
    id: 'clw1h9o0p000bm8igmnop7890',
    descricao: 'Primeira parcela do pagamento - Família Silva',
    valor: '250000.00',
    data: new Date('2023-08-10T00:00:00.000Z'),
    obraId: obras[1].id,
  },
];

export const estoque = [
  {
    id: 'clw1i2q3r000cm8igqrst1234',
    item: 'Saco de Cimento (50kg)',
    quantidade: '250.00', // Restante da compra
    unidade: 'UN',
    custoUnitario: '30.00',
    obraId: obras[1].id,
    supplierId: suppliers[0].id,
  },
];

export const documents = [
  {
    id: 'clw1j3s4t000dm8iguvw5678',
    name: 'Planta Baixa - Térreo',
    url: '/docs/residencial-araucaria/planta-terreo.pdf',
    type: 'PLANTA_BAIXA',
    uploadedAt: new Date(),
    obraId: obras[1].id,
  },
];

export const workLogs = [
  {
    id: 'clw1k4u5v000em8igwxyz9012',
    date: new Date(),
    notes: 'Iniciada a concretagem da laje do segundo pavimento. Clima favorável.',
    photos: ['/logs/photo1.jpg', '/logs/photo2.jpg'],
    obraId: obras[1].id,
    authorId: users[2].id, // Log feito por Eduardo
  },
];