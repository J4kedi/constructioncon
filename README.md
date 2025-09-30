# ConstructionCon 🏗️

## 1. Contexto do Projeto

O ConstructionCon é um software de gestão de obras no modelo *multi-tenant*, projetado para otimizar a administração de construtoras. A plataforma centraliza funcionalidades de ERP e CRM, facilitando a gestão de múltiplos projetos, equipes e clientes em um ambiente unificado e seguro.

O sistema permite que cada construtora (tenant) tenha seu próprio ambiente isolado, com um administrador que pode gerenciar seus funcionários (usuários) e clientes finais (end-customers).

## 2. Dependências

Para executar este projeto localmente, você precisará ter instalado:

- **Node.js**: Versão 18.x ou superior.
- **pnpm**: Versão 10.x ou superior (conforme especificado no `package.json`).
- **Docker** e **Docker Compose**: Para executar o banco de dados PostgreSQL em um contêiner.

## 3. Setup do Ambiente de Desenvolvimento

Siga os passos abaixo para configurar e executar o projeto.

### 3.1. Configuração Inicial (Comum a todos os cenários)

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd constructioncon
    ```

2.  **Instale as Dependências:**
    ```bash
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env` e preencha a variável `DATABASE_URL` com a string de conexão do seu banco de dados PostgreSQL.
    ```bash
    cp .env.example .env
    ```

### 3.2. Cenário A: Setup Rápido com Ambiente de Demonstração (Recomendado)

Este cenário é ideal para a maioria dos casos de desenvolvimento. Ele sobe o banco de dados e o popula com um conjunto rico de dados de demonstração (3 tenants, com obras, usuários, etc.).

1.  **Execute o Script Mestre de Setup:**
    Este comando único irá orquestrar todo o processo.
    ```bash
    pnpm run setup:dev
    ```

2.  **Inicie a Aplicação:**
    ```bash
    pnpm run dev
    ```

Pronto! A aplicação estará rodando e populada com dados de demonstração.

### 3.3. Cenário B: Setup Manual com um Tenant Limpo

Este cenário é útil se você precisa de um ambiente limpo com um único tenant para testes específicos.

1.  **Inicie o Banco de Dados:**
    ```bash
    docker-compose up -d
    ```

2.  **Aplique a Migração Inicial:**
    Este comando cria as tabelas no schema `public`.
    ```bash
    pnpm prisma migrate deploy
    ```

3.  **Popule os Dados Públicos:**
    Cria as `features` globais do sistema.
    ```bash
    pnpm run db:seed:public
    ```

4.  **Provisione seu Novo Tenant:**
    Substitua `<NomeDaEmpresa>` e `<subdominio>`.
    ```bash
    pnpm run db:provision "Minha Construtora" minha-construtora
    ```

5.  **Popule o Tenant com o Admin:**
    Use o mesmo subdomínio do passo anterior.
    ```bash
    pnpm run db:seed:tenant minha-construtora
    ```
    *Login padrão: `admin@constructioncon.com` | `Qwe123@@`*

6.  **Inicie a Aplicação:**
    ```bash
    pnpm run dev
    ```

## 4. Referência de Scripts

Todos os scripts de automação estão disponíveis no `package.json` e podem ser executados com `pnpm run <nome-do-script>`.

| Comando | Descrição |
| :--- | :--- |
| `setup:dev` | **(Recomendado)** Orquestrador completo: sobe o Docker, reseta o DB e executa o seed de demonstração. |
| `db:seed:demo` | Popula o banco com um conjunto completo de dados de demonstração (cria e semeia 3 tenants). |
| `db:provision <n> <s>` | Provisiona um novo tenant limpo com nome `<n>` e subdomínio `<s>`. |
| `db:seed:tenant <s>` | Popula um tenant existente `<s>` com os dados essenciais (Admin, etc). |
| `db:deprovision <s>` | Apaga um tenant específico `<s>` e seu schema. |
| `db:cleanup -- --force`| **(Destrutivo)** Apaga **TODOS** os tenants e schemas do banco de dados. |
| `db:seed:public` | Popula apenas a tabela `public.features`. |
| `db:migrate:tenants` | Aplica migrações pendentes a todos os tenants existentes. |
| `db:migrate:resolve <m>`| Resolve um conflito de migração `<m>` em todos os tenants. |

