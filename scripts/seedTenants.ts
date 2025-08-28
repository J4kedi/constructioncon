import { getTenantPrismaClient } from "@/app/lib/prisma";
import { 
  PrismaClient, 
  UserRole, 
  StatusObra, 
  StatusEtapa, 
  CategoriaDespesa, 
  UnidadeMedida, 
  DocumentType 
} from "@prisma/client";
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
} from "../app/lib/placeholder-data";
import { hash } from "bcrypt";

// Mapeia o nome do tenant para a empresa correspondente
const tenantToCompany = {
  amazonia: 'Amazônia Engenharia e Construções',
  parana: 'Paraná Prime Construtora',
  sul: 'Sul Forte Empreendimentos',
};

async function seedTenant(
  tenantName: keyof typeof tenantToCompany,
  prisma: PrismaClient,
) {
  const companyName = tenantToCompany[tenantName];
  const company = companys.find((c) => c.name === companyName);

  if (!company) {
    console.error(`❌ Empresa para o tenant '${tenantName}' não encontrada.`);
    return;
  }

  console.log(`--- Populando dados para o tenant '${tenantName}' ---`);

  // 1. Limpar dados existentes (ordem reversa de dependência)
  await prisma.workLog.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.estoque.deleteMany({});
  await prisma.receita.deleteMany({});
  await prisma.despesa.deleteMany({});
  await prisma.etapa.deleteMany({});
  await prisma.obra.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.company.deleteMany({});
  console.log('🧹 Dados antigos limpos.');

  // 2. Popular dados (ordem de dependência)
  await prisma.company.create({ data: company });
  console.log('🏢 Empresa criada:', company.name);

  const companyUsers = users.filter((u) => u.companyId === company.id);
  for (const user of companyUsers) {
    const { companyId, ...userData } = user;
    const hashedPassword = await hash(userData.password, 10);
    await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: userData.role as UserRole,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  }
  console.log(`👤 ${companyUsers.length} usuários criados.`);

  const companySuppliers = suppliers.filter(s => 
    despesas.some(d => d.supplierId === s.id && obras.some(o => o.id === d.obraId && o.companyId === company.id)) ||
    estoque.some(e => e.supplierId === s.id && obras.some(o => o.id === e.obraId && o.companyId === company.id))
  );
  await prisma.supplier.createMany({ data: companySuppliers });
  console.log(`🚚 ${companySuppliers.length} fornecedores criados.`);

  const companyAddresses = addresses.filter(a => a.companyId === company.id || companySuppliers.some(s => s.id === a.supplierId));
  await prisma.address.createMany({ data: companyAddresses });
  console.log(`📫 ${companyAddresses.length} endereços criados.`);

  const companyObras = obras.filter((o) => o.companyId === company.id);
  await prisma.obra.createMany({ 
    data: companyObras.map(o => ({...o, status: o.status as StatusObra, dataInicio: o.dataInicio.toISOString(), dataPrevistaFim: o.dataPrevistaFim.toISOString()}))
  });
  console.log(`🏗️ ${companyObras.length} obras criadas.`);

  const companyEtapas = etapas.filter((e) => companyObras.some((o) => o.id === e.obraId));
  await prisma.etapa.createMany({ 
    data: companyEtapas.map(e => ({...e, status: e.status as StatusEtapa, dataInicioPrevista: e.dataInicioPrevista.toISOString(), dataFimPrevista: e.dataFimPrevista.toISOString(), dataInicioReal: e.dataInicioReal?.toISOString(), dataFimReal: e.dataFimReal?.toISOString()}))
  });
  console.log(`📋 ${companyEtapas.length} etapas criadas.`);

  const companyDespesas = despesas.filter((d) => companyObras.some((o) => o.id === d.obraId));
  await prisma.despesa.createMany({ 
    data: companyDespesas.map(d => ({...d, categoria: d.categoria as CategoriaDespesa, data: d.data.toISOString()}))
  });
  console.log(`💸 ${companyDespesas.length} despesas criadas.`);
  
  const companyReceitas = receitas.filter((r) => companyObras.some((o) => o.id === r.obraId));
  await prisma.receita.createMany({ 
    data: companyReceitas.map(r => ({...r, data: r.data.toISOString()}))
  });
  console.log(`💰 ${companyReceitas.length} receitas criadas.`);

  const companyEstoque = estoque.filter((e) => companyObras.some((o) => o.id === e.obraId));
  await prisma.estoque.createMany({ 
    data: companyEstoque.map(e => ({...e, unidade: e.unidade as UnidadeMedida}))
  });
  console.log(`📦 ${companyEstoque.length} itens de estoque criados.`);

  const companyDocuments = documents.filter((d) => companyObras.some((o) => o.id === d.obraId));
  await prisma.document.createMany({ 
    data: companyDocuments.map(d => ({...d, type: d.type as DocumentType, uploadedAt: d.uploadedAt.toISOString()}))
  });
  console.log(`📄 ${companyDocuments.length} documentos criados.`);

  const companyWorkLogs = workLogs.filter((w) => companyObras.some((o) => o.id === w.obraId));
  await prisma.workLog.createMany({ 
    data: companyWorkLogs.map(w => ({...w, date: w.date.toISOString()}))
  });
  console.log(`👷 ${companyWorkLogs.length} diários de obra criados.`);
}

async function main() {
  console.log('Iniciando o seed dos dados de teste...');

  for (const tenantName of Object.keys(tenantToCompany) as Array<keyof typeof tenantToCompany>) {
    const prisma = getTenantPrismaClient(tenantName);
    try {
      await seedTenant(tenantName, prisma);
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
});
