# Home Renovation Project Tracker

Monorepo configurado com Turbo Repo contendo frontend (Next.js + Apollo Client) e backend (NestJS + GraphQL + Prisma).

## Stack Tecnológica

### Frontend

- **React** - Biblioteca UI
- **Next.js** - Framework React
- **Apollo Client** - Cliente GraphQL
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização

### Backend

- **Node.js** - Runtime JavaScript
- **NestJS** - Framework Node.js
- **GraphQL** - API Query Language
- **Apollo Server** - Servidor GraphQL
- **Prisma** - ORM
- **MySQL** - Banco de dados
- **TypeScript** - Tipagem estática

## Estrutura do Projeto

```
.
├── apps/
│   ├── frontend/     # Next.js app
│   └── backend/      # NestJS app
├── package.json      # Root package.json
└── turbo.json        # Configuração Turbo Repo
```

## Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL (instalado e rodando)

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

No diretório `apps/backend`, crie um arquivo `.env` com:

```env
DATABASE_URL="mysql://user:password@localhost:3306/home_renovation_db"
PORT=4000
FRONTEND_URL=http://localhost:3001
```

### 3. Configurar Prisma

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

### 4. Configurar Frontend

No diretório `apps/frontend`, crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Scripts Disponíveis

### Root (Turbo Repo)

- `npm run dev` - Inicia todos os apps em modo desenvolvimento
- `npm run build` - Builda todos os apps
- `npm run start` - Inicia todos os apps em produção
- `npm run lint` - Executa lint em todos os apps

### Backend

- `npm run dev` - Inicia servidor em modo watch
- `npm run build` - Builda o projeto
- `npm run start` - Inicia servidor em produção
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:migrate` - Executa migrations
- `npm run prisma:studio` - Abre Prisma Studio

### Frontend

- `npm run dev` - Inicia servidor de desenvolvimento (porta 3001)
- `npm run build` - Builda o projeto
- `npm run start` - Inicia servidor de produção

## Desenvolvimento

1. Inicie o MySQL
2. Configure as variáveis de ambiente
3. Execute as migrations do Prisma
4. Inicie os servidores:

```bash
npm run dev
```

- Frontend: http://localhost:3001
- Backend GraphQL: http://localhost:4000/graphql

## GraphQL Playground

Acesse http://localhost:4000/graphql para usar o GraphQL Playground e testar suas queries.

## Próximos Passos

1. Defina seus modelos no `apps/backend/prisma/schema.prisma`
2. Execute `npm run prisma:migrate` para criar as tabelas
3. Crie seus resolvers GraphQL no backend
4. Crie seus componentes React no frontend usando Apollo Client
