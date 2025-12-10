# Home Renovation Project Tracker

Monorepo containing a Next.js frontend and a NestJS GraphQL backend (Prisma for persistence).

## Overview

This application tracks home renovation projects (jobs). Homeowners create projects and contractors manage them — updating status and cost, and exchanging messages.

## Tech stack (summary)

- Frontend: Next.js, React, Apollo Client, TypeScript, MUI
- Backend: NestJS, Apollo Server (GraphQL), Prisma, TypeScript
- Database: MySQL (or any DB configured via `DATABASE_URL`)

## Main entities

- `User` — system user with `role` (either `HOMEOWNER` or `CONTRACTOR`), `name`, `email`. Passwords are handled securely on the backend.
- `Job` — a renovation project with fields like `id`, `title/name`, `description`, `address`, `status`, `cost`, `homeownerId`, `contractorId`, `createdAt`, `updatedAt`.
- `Message` — chat messages attached to a `Job`.

Entity models live in `apps/backend/prisma/schema.prisma` and business rules live in backend use-case layers.

## Prerequisites

- Node.js >= 18
- npm
- MySQL (or other DB set in `DATABASE_URL`)

## Development quick start

1. Install dependencies from project root:

```bash
npm install
```

2. Configure environment variables

- Backend: create `apps/backend/.env` with:

```env
DATABASE_URL="mysql://user:password@localhost:3306/home_renovation_db"
PORT=4000
FRONTEND_URL=http://localhost:3001
```

- Frontend: create `apps/frontend/.env.local` with:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

3. Generate Prisma client and run migrations (backend):

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

4. Start apps in development (from project root):

```bash
npm run dev
```

Useful URLs

- Frontend: http://localhost:3001
- GraphQL Playground: http://localhost:4000/graphql

## Create users (GraphQL)

You need at least two users for the flows to work locally: one `CONTRACTOR` and one `HOMEOWNER`.

Open the GraphQL Playground (`http://localhost:4000/graphql`) and run the `createUser` mutation. Example:

```graphql
mutation CreateContractor {
  createUser(
    input: {
      email: "contractor@example.com"
      name: "Contractor One"
      password: "password123"
      role: CONTRACTOR
    }
  ) {
    id
    name
    email
    role
    createdAt
  }
}

mutation CreateHomeowner {
  createUser(
    input: {
      email: "homeowner@example.com"
      name: "Homeowner One"
      password: "password123"
      role: HOMEOWNER
    }
  ) {
    id
    name
    email
    role
    createdAt
  }
}
```

After creating users you can `login` (GraphQL mutation) to retrieve auth tokens, or for quick local testing populate the frontend `localStorage` with a user object (see `apps/frontend/lib/auth` for helpers).

## Jobs and testing flows

- As a `CONTRACTOR`: create a job (UI or `createJob` mutation) and update its `cost` and `status` from the job page.
- Frontend GraphQL operations live in `apps/frontend/lib/graphql`.

## Notes & next steps

- Currently the frontend uses `refetchQueries` after updates to keep Apollo cache in sync. For improved UX we can switch to `optimisticResponse` + `cache.modify`.
- If you want, I can add a `seed` script that creates a default `CONTRACTOR`, `HOMEOWNER`, and some sample jobs.

---

If you'd like a seed script or would like me to implement optimistic cache updates, tell me which and I'll add it.
