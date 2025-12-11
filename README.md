# Home Renovation Project Tracker

Monorepo containing a Next.js frontend and a NestJS GraphQL backend (Prisma for persistence).

## Overview

This application tracks home renovation projects (jobs). Homeowners create projects and contractors manage them — updating status and cost, and exchanging messages.

## Tech stack (summary)

- Frontend: Next.js, React, Apollo Client, TypeScript, MUI
- Backend: NestJS, Apollo Server (GraphQL), Prisma, TypeScript
- Database: SQLite

## Main entities

- `User` — system user with `role` (either `HOMEOWNER` or `CONTRACTOR`), `name`, `email`. Passwords are handled securely on the backend.
- `Job` — a renovation project with fields like `id`, `title/name`, `description`, `address`, `status`, `cost`, `homeownerId`, `contractorId`, `createdAt`, `updatedAt`.
- `Subtask` — a list of a `Job` subtasks
- `Message` — chat messages attached to a `Job`.

Entity models live in `apps/backend/prisma/schema.prisma` and business rules live in backend use-case layers.

## Prerequisites

- Node.js >= 20
- npm

## Development quick start

1. Install dependencies from project root:

```bash
npm install
```

2. Generate Prisma client and run migrations (backend):

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

3. Start apps in development (from project root):

```bash
npm run dev
```

Useful URLs

- Frontend: http://localhost:3001
- GraphQL Playground: http://localhost:4000/graphql

## Create users

You need at least two users for the flows to work locally: one `CONTRACTOR` and one `HOMEOWNER`.

The frontend includes a small admin UI for creating users. Open the app and visit the admin users page to create accounts using a form (no GraphQL call required):

- Frontend admin URL: `http://localhost:3001/admin/users`

Use the form to create a `CONTRACTOR` and a `HOMEOWNER`. After creating users you can `login` (GraphQL mutation) to retrieve auth tokens, or for quick local testing populate the frontend `localStorage` with a user object (see `apps/frontend/lib/auth` for helpers).

If you prefer to use the API directly you can still use the GraphQL Playground at `http://localhost:4000/graphql` and run the `createUser` mutation, but the admin UI is the easiest path for local development.

After creating users you can `login` (GraphQL mutation) to retrieve auth tokens, or for quick local testing populate the frontend `localStorage` with a user object (see `apps/frontend/lib/auth` for helpers).

## Jobs and testing flows

- As a `CONTRACTOR`: create a job and update its `cost` and `status` from the job page.
- Frontend GraphQL operations live in `apps/frontend/lib/graphql`.
