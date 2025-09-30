import { getTenantPrismaClient, getPublicPrismaClient } from '../app/lib/prisma.ts';
import { PrismaClient } from '@prisma/client';
import { companys, users, suppliers, addresses, obras, etapas, despesas, receitas, estoque, documents, workLogs } from '../app/lib/placeholder-data.ts';
import { ALL_FEATURES, DEFAULT_FEATURE_KEYS } from '../app/lib/features.ts';
import bcrypt from 'bcrypt';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const publicPrisma = getPublicPrismaClient();

const tenantToCompany = {
  amazonia: 'Amazônia Engenharia e Construções',
  parana: 'Paraná Prime Construtora',
  sul: 'Sul Forte Empreendimentos',
};

const tenantFeatures = {
    amazonia: DEFAULT_FEATURE_KEYS,
    parana: [...DEFAULT_FEATURE_KEYS, 'advanced-reporting'],
    sul: DEFAULT_FEATURE_KEYS,
}

function applyMigrations(schemaName: string): void {
  console.log(`\n--- Aplicando migrações ao schema '${schemaName}' ---`);
  const migrationDir = path.join(process.cwd(), 'prisma', 'migrations');
  const originalMigrations = new Map<string, string>();

  try {
    const migrationFolders = fs.readdirSync(migrationDir).filter(file => 
      fs.statSync(path.join(migrationDir, file)).isDirectory()
    );

    if (migrationFolders.length === 0) {
      console.log('⚠️ Nenhuma migração encontrada para aplicar.');
      return;
    }

    console.log(`🔧 Encontradas ${migrationFolders.length} migrações. Modificando temporariamente...`);

    for (const folder of migrationFolders) {
      const filePath = path.join(migrationDir, folder, 'migration.sql');
      if (fs.existsSync(filePath)) {
        const originalContent = fs.readFileSync(filePath, 'utf-8');
        originalMigrations.set(filePath, originalContent);
        
        const tenantSafeContent = originalContent.replace(/"public"\./g, '');
        fs.writeFileSync(filePath, tenantSafeContent, 'utf-8');
      }
    }
    console.log('✅ Arquivos de migração modificados.');

    const databaseUrlBase = process.env.DATABASE_URL;
    if (!databaseUrlBase) {
      throw new Error('DATABASE_URL não definida no .env');
    }

    const tenantDatabaseUrl = `${databaseUrlBase}?schema=${schemaName}&search_path=${schemaName}`;

    console.log('▶️  Executando prisma migrate deploy com as migrações modificadas...');
    execSync(`pnpm prisma migrate deploy`, {
        stdio: 'inherit',
        env: {
            ...process.env,
            DATABASE_URL: tenantDatabaseUrl,
        },
    });
    console.log(`✅ Migrações aplicadas com sucesso para o schema '${schemaName}'.`);

  } catch (error) {
      console.error(`❌ Falha crítica ao aplicar migrações para '${schemaName}'.`);
      throw error;
  } finally {
    if (originalMigrations.size > 0) {
      console.log('🔄 Restaurando arquivos de migração originais...');
      for (const [filePath, originalContent] of originalMigrations) {
        fs.writeFileSync(filePath, originalContent, 'utf-8');
      }
      console.log('✅ Arquivos de migração restaurados.');
    }
  }
}

async function seedTenantData(tenantName: keyof typeof tenantToCompany, prisma: PrismaClient) {
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
          company: { connect: { id: companyId } },
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
    const companySuppliers = suppliers.filter(s => companyDespesas.some(d => d.supplierId === s.id) || companyEstoque.some(e => e.supplierId === s.id));
    const companyAddresses = addresses.filter(a => a.companyId === company.id || companySuppliers.some(s => s.id === a.supplierId));

    await tx.supplier.createMany({ data: companySuppliers });
    await tx.address.createMany({ data: companyAddresses });
    await tx.obra.createMany({ data: companyObras });
    await tx.etapa.createMany({ data: companyEtapas });
    await tx.despesa.createMany({ data: companyDespesas });
    await tx.receita.createMany({ data: companyReceitas });
    await tx.estoque.createMany({ data: companyEstoque });
    await tx.document.createMany({ data: companyDocuments });
    await tx.workLog.createMany({ data: companyWorkLogs });
    console.log(`✅ ${companyObras.length} obras com todos os dados relacionados criadas.`);
  });
}

async function main() {
  console.log('Iniciando o seed completo do ambiente de demonstração...');

  console.log('\n--- Etapa 1: Populando schema public (Features) ---');
  await publicPrisma.feature.createMany({ data: ALL_FEATURES, skipDuplicates: true });
  console.log(`✅ ${ALL_FEATURES.length} features garantidas no schema public.`);

  console.log('\n--- Etapa 2: Provisionando e populando cada tenant de demonstração ---');
  for (const tenantName of Object.keys(tenantToCompany) as Array<keyof typeof tenantToCompany>) {
    console.log(`\n--------------------------------------------------------------------`);
    console.log(`PROCESSANDO TENANT: ${tenantName.toUpperCase()}`);
    console.log(`--------------------------------------------------------------------`);
    
    const schemaName = `tenant_${tenantName}`;
    const featureKeys = tenantFeatures[tenantName];
    
    await publicPrisma.tenant.upsert({
        where: { subdomain: tenantName },
        update: { features: { set: featureKeys.map(key => ({ key })) } },
        create: {
            name: tenantToCompany[tenantName],
            subdomain: tenantName,
            schemaName: schemaName,
            features: { connect: featureKeys.map(key => ({ key })) }
        }
    });
    console.log(`✅ Registro do tenant '${tenantName}' garantido no schema public.`);

    await publicPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);
    console.log(`✅ Schema '${schemaName}' garantido no banco de dados.`);

    applyMigrations(schemaName);

    const tenantPrisma = getTenantPrismaClient(tenantName);
    try {
      await seedTenantData(tenantName, tenantPrisma);
      console.log(`✅ Dados de demonstração para '${tenantName}' inseridos com sucesso.`);
    } catch (error) {
      console.error(`❌ Erro ao popular dados para '${tenantName}':`, error);
    } finally {
      await tenantPrisma.$disconnect();
    }
  }

  console.log('\n🚀 Seed completo do ambiente de demonstração concluído.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
    await publicPrisma.$disconnect();
});