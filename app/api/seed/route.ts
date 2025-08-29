import { getTenantPrismaClient, getPublicPrismaClient } from '@/app/lib/prisma';
import { PrismaClient } from '@prisma/client';
import {
  companys,
  users,
  suppliers,
  addresses,
  obras,
  etapas,
  despesas,
  receitas,
  estoque,
  documents,
  workLogs,
} from '@/app/lib/placeholder-data';
import bcrypt from 'bcrypt';

const publicPrisma = getPublicPrismaClient();

const tenantToCompany = {
  amazonia: 'Amazônia Engenharia e Construções',
  parana: 'Paraná Prime Construtora',
  sul: 'Sul Forte Empreendimentos',
};

const tenantFeatures = {
    amazonia: ['dashboard-basic', 'financial-view', 'user-management', 'inventory-management'],
    parana: ['dashboard-basic', 'financial-view', 'user-management', 'inventory-management', 'advanced-reporting'],
    sul: ['dashboard-basic'],
}

async function seedTenantData(
  tenantName: keyof typeof tenantToCompany,
  prisma: PrismaClient,
) {
  const companyName = tenantToCompany[tenantName];
  const company = companys.find((c) => c.name === companyName);

  if (!company) {
    console.error(`❌ Empresa para o tenant '${tenantName}' não encontrada.`);
    return;
  }

  console.log(`--- Populando dados para o tenant '${tenantName}' via transação ---`);

  await prisma.$transaction(async (tx) => {
    await tx.workLog.deleteMany({});
    await tx.document.deleteMany({});
    await tx.estoque.deleteMany({});
    await tx.receita.deleteMany({});
    await tx.despesa.deleteMany({});
    await tx.etapa.deleteMany({});
    await tx.obra.deleteMany({});
    await tx.address.deleteMany({});
    await tx.user.deleteMany({});
    await tx.supplier.deleteMany({});
    await tx.company.deleteMany({});
    console.log('🧹 Dados antigos do schema do tenant limpos.');

    await tx.company.create({ data: company });
    console.log('🏢 Empresa criada:', company.name);

    const companyUsers = users.filter((u) => u.companyId === company.id);
    for (const user of companyUsers) {
      const { companyId, ...userData } = user;
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await tx.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role: userData.role,
          company: {
            connect: { id: companyId },
          },
        },
      });
    }
    console.log(`👤 ${companyUsers.length} usuários criados.`);
    
    const companyObras = obras.filter((o) => o.companyId === company.id);
    const companyEtapas = etapas.filter((e) => companyObras.some((o) => o.id === e.obraId));
    const companyDespesas = despesas.filter((d) => companyObras.some((o) => o.id === d.obraId));
    const companyReceitas = receitas.filter((r) => companyObras.some((o) => o.id === r.obraId));
    const companyEstoque = estoque.filter((e) => companyObras.some((o) => o.id === e.obraId));
    const companyDocuments = documents.filter((d) => companyObras.some((o) => o.id === d.obraId));
    const companyWorkLogs = workLogs.filter((w) => companyObras.some((o) => o.id === w.obraId));
    
    const companySuppliers = suppliers.filter(s => 
      companyDespesas.some(d => d.supplierId === s.id) ||
      companyEstoque.some(e => e.supplierId === s.id)
    );

    const companyAddresses = addresses.filter(a => a.companyId === company.id || companySuppliers.some(s => s.id === a.supplierId));

    await tx.supplier.createMany({ data: companySuppliers });
    console.log(`🚚 ${companySuppliers.length} fornecedores criados.`);
    
    await tx.address.createMany({ data: companyAddresses });
    console.log(`📫 ${companyAddresses.length} endereços criados.`);

    await tx.obra.createMany({ data: companyObras });
    console.log(`🏗️ ${companyObras.length} obras criadas.`);

    await tx.etapa.createMany({ data: companyEtapas });
    console.log(`📋 ${companyEtapas.length} etapas criadas.`);

    await tx.despesa.createMany({ data: companyDespesas });
    console.log(`💸 ${companyDespesas.length} despesas criadas.`);
    
    await tx.receita.createMany({ data: companyReceitas });
    console.log(`💰 ${companyReceitas.length} receitas criadas.`);

    await tx.estoque.createMany({ data: companyEstoque });
    console.log(`📦 ${companyEstoque.length} itens de estoque criados.`);

    await tx.document.createMany({ data: companyDocuments });
    console.log(`📄 ${companyDocuments.length} documentos criados.`);

    await tx.workLog.createMany({ data: companyWorkLogs });
    console.log(`👷 ${companyWorkLogs.length} diários de obra criados.`);
  });
}

async function main() {
  console.log('Iniciando o seed dos dados de teste...');

  console.log('--- Populando schema public: Features e Tenants ---');
  const featuresToCreate = [
      {
          key: 'dashboard-basic',
          name: 'Dashboard Básico',
          description: 'Acesso à visualização de Acompanhamento.'
      },
      {
          key: 'financial-view',
          name: 'Visualização Financeira',
          description: 'Acesso ao dashboard Financeiro.'
      },
      {
          key: 'user-management',
          name: 'Gerenciamento de Usuários',
          description: 'Permite gerenciar os usuários da empresa.'
      },
      {
          key: 'inventory-management',
          name: 'Gerenciamento de Estoque',
          description: 'Acesso ao controle de estoque.'
      },
      {
          key: 'advanced-reporting',
          name: 'Relatórios Avançados',
          description: 'Permite a exportação de relatórios detalhados.'
      }
  ];

  await publicPrisma.feature.createMany({
      data: featuresToCreate,
      skipDuplicates: true, 
  });
  console.log(`✅ ${featuresToCreate.length} features garantidas no schema public.`);

  for (const tenantName of Object.keys(tenantToCompany) as Array<keyof typeof tenantToCompany>) {
      const featureKeys = tenantFeatures[tenantName];
      
      await publicPrisma.tenant.upsert({
          where: { subdomain: tenantName },
          update: {
              features: {
                  set: featureKeys.map(key => ({ key }))
              }
          },
          create: {
              name: tenantToCompany[tenantName],
              subdomain: tenantName,
              schemaName: `tenant_${tenantName}`,
              features: {
                  connect: featureKeys.map(key => ({ key }))
              }
          }
      });
      console.log(`✅ Tenant '${tenantName}' garantido com ${featureKeys.length} features.`);
  }
  console.log('--- Schema public finalizado ---');

  for (const tenantName of Object.keys(tenantToCompany) as Array<keyof typeof tenantToCompany>) {
    const prisma = getTenantPrismaClient(tenantName);
    try {
      await seedTenantData(tenantName, prisma);
      console.log(`✅ Dados para '${tenantName}' inseridos com sucesso.
`);
    } catch (error) {
      console.error(`❌ Erro ao popular dados para '${tenantName}':`, error);
    } finally {
      await prisma.$disconnect();
    }
  }

  console.log('🚀 Seed concluído.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
    await publicPrisma.$disconnect();
});