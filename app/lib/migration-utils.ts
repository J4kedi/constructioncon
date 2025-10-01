import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function runTenantSafeDeploy(schemaName: string): void {
  console.log(`\n--- Aplicando migrações ao schema '${schemaName}' de forma segura ---`);
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

    console.log('▶️  Executando prisma migrate deploy com a migração modificada...');
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
