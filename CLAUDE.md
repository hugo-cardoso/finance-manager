# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Finance Manager is a personal finance management application with transaction tracking, categorization, and budget management. The application uses a monorepo structure with Turbo and pnpm workspaces.

**Deployment**: All applications and databases are hosted on Railway.

**Requirements**:
- Node.js v22
- pnpm 10.13.1 or higher

## Monorepo Structure

```
finance-manager/
├── apps/
│   ├── frontend/    # React + TanStack Start SSR frontend
│   └── api/         # NestJS REST API backend
├── turbo.json       # Turbo build orchestration
└── pnpm-workspace.yaml
```

## Commands

### Root Level (Monorepo)
- `pnpm dev` - Start all apps in development mode (uses Turbo)
- `pnpm build` - Build all apps (uses Turbo)
- `pnpm lint` - Lint all apps (uses Turbo)
- `pnpm type-check` - Type check all apps (uses Turbo)

### Frontend (`apps/frontend/`)
- `pnpm dev` - Start Vite dev server on port 5173
- `pnpm build` - Build production bundle (runs type-check and lint first)
- `pnpm start` - Start production server (uses Nitro)
- `pnpm preview` - Preview production build on port 5173
- `pnpm test` - Run Vitest tests
- `pnpm lint` - Lint with Biome
- `pnpm type-check` - TypeScript type checking

### API (`apps/api/`)
- `pnpm dev` - Start NestJS in watch mode (includes `prisma generate`)
- `pnpm build` - Build production bundle (includes `prisma generate`)
- `pnpm start` - Start production server
- `pnpm test` - Run Jest tests
- `pnpm lint` - Lint with Biome
- `pnpm type-check` - TypeScript type checking

### Database (from `apps/api/`)
- `pnpx prisma migrate dev` - Create and apply migrations in development
- `pnpx prisma migrate deploy` - Apply migrations in production
- `pnpx prisma generate` - Generate Prisma Client (outputs to `src/generated/prisma`)
- `pnpx prisma studio` - Open Prisma Studio database GUI

## Architecture

### Frontend Stack

**Framework**: React 19 with TanStack Start (SSR framework based on TanStack Router)

**Key Libraries**:
- **Routing**: TanStack Router with file-based routing (routes in `src/routes/`)
- **State Management**:
  - Jotai for global client state
  - TanStack Query for server state and caching
- **UI**: Mantine v8 components + Tailwind CSS v4
- **Forms**: Mantine Form with Zod validation
- **HTTP Client**: ky (configured with auth interceptors)
- **Build**: Vite with Nitro for SSR

**Important Patterns**:
- File-based routing uses TanStack Router conventions (`_authenticated/` for protected routes)
- Authentication uses `cookieStore` API with `access_token` cookie
- API client in `src/lib/api/index.ts` handles JWT token injection and 401 redirects
- Route protection via `beforeLoad` hooks (see `_authenticated/route.tsx`)
- SSR disabled for authenticated routes (`ssr: false`)
- React Query integration with router for SSR data fetching

**Frontend Structure**:
```
src/
├── routes/              # File-based routes (TanStack Router)
│   ├── __root.tsx      # Root layout
│   ├── _authenticated/ # Protected routes (dashboard, profile, etc.)
│   └── auth/           # Public auth routes (sign-in, sign-up)
├── layouts/            # Layout components (PrivateLayout)
├── components/         # Reusable UI components
├── hooks/
│   └── queries/        # React Query hooks (useUserQuery, etc.)
├── lib/
│   └── api/            # API client configuration with auth
├── providers/          # Context providers (Mantine theme)
├── services/           # API service classes
└── utils/              # Utility functions
```

### Backend Stack

**Framework**: NestJS with Express

**Key Libraries**:
- **ORM**: Prisma with PostgreSQL adapter
- **Auth**: Passport (local + JWT strategies)
- **Validation**: class-validator + class-transformer

**Database**:
- PostgreSQL hosted on Railway
- Prisma schema at `apps/api/prisma/schema.prisma`
- Generated client outputs to `src/generated/prisma` (custom output path)
- Uses `@prisma/adapter-pg` for connection pooling

**Important Patterns**:
- Module-based architecture (AuthModule, UsersModule, TransactionsModule, CategoriesModule)
- Global JWT module with 1-hour token expiration
- PrismaService extends PrismaClient for dependency injection
- Custom decorator `@AuthUserId()` extracts user ID from JWT
- DTOs use class-validator for request validation
- Global API prefix `/api` on all routes
- CORS enabled globally

**API Structure**:
```
src/
├── modules/
│   ├── auth/           # Authentication (sign-in, sign-up)
│   ├── users/          # User management
│   ├── categories/     # Transaction categories
│   └── transactions/   # Transaction CRUD + recurrence logic
├── common/
│   ├── database/       # PrismaService
│   ├── decorator/      # Custom decorators (AuthUserId)
│   └── utils/          # DateUtils and helpers
└── generated/prisma/   # Prisma Client (auto-generated)
```

### Database Schema

**Core Models**:
- `User` - Authentication and user data
- `Category` - Transaction categories (income/expense) with icons
- `Transaction` - Financial transactions with support for:
  - Single transactions
  - Installments (parcelas)
  - Recurring transactions (mensalidades)
- `RecurrenceRule` - Rules for recurring transactions

**Transaction System**:
- Type: `income` or `expense`
- Recurrence: `single`, `installment`, or `recurrence`
- Status: `active` or `deleted` (soft delete)
- Installments track: `installmentId`, `installmentNumber`, `installmentTotal`
- Recurring transactions reference `RecurrenceRule` (dayOfMonth, isActive)

## Environment Variables

### Frontend (`.env`)
- `VITE_API_URL` - API base URL (default: https://finance-api.hcardoso.com.br)

### API (`.env`)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing

## Code Style

- **Formatter/Linter**: Biome (configured in `biome.json`)
- **Quote Style**: Double quotes
- **Indent**: 2 spaces
- **Line Width**: 120 characters
- **Import Organization**: Auto-organize imports on save
- **TypeScript**: Strict mode enabled

## Development Notes

- Turbo caching is configured with task dependencies (`build` depends on `type-check` and `lint`)
- Frontend build outputs to `.output/` (Nitro)
- API build outputs to `dist/`
- Prisma Client must be generated before building/running API
- Authentication flow: Local strategy for login → JWT for protected routes
- Frontend uses cookie-based auth with automatic token refresh on 401
- All API routes are prefixed with `/api`
- Frontend uses SSR for public routes, CSR for authenticated routes

## Testing

### Frontend
- **Framework**: Vitest with React Testing Library
- **DOM**: jsdom environment
- Run: `pnpm test` in `apps/frontend/`

### API
- **Framework**: Jest with ts-jest
- **Config**: In `package.json` (rootDir: `src/`, testRegex: `.*\.spec\.ts$`)
- Run: `pnpm test` in `apps/api/`

## Git Workflow

**Branch Naming Convention**: All branches must start with:
- `feature/` - For new features (e.g., `feature/add-budget-tracking`)
- `fix/` - For bug fixes (e.g., `fix/transaction-date-validation`)

## Common Workflows

### Adding a New API Endpoint
1. Add route/controller method in appropriate module
2. Create/update DTOs with validation decorators
3. Update service layer logic
4. Run `pnpm type-check` and `pnpm lint` in `apps/api/`

### Adding a Database Migration
1. Modify `apps/api/prisma/schema.prisma`
2. Run `pnpx prisma migrate dev --name migration_name`
3. Prisma Client regenerates automatically
4. Update services/DTOs to reflect schema changes

### Adding a New Frontend Route
1. Create file in `src/routes/` following TanStack Router conventions
2. Define route with `createFileRoute()`
3. Add React Query hooks if server data is needed
4. Protected routes go under `_authenticated/`

### Deploying to Railway
- Frontend and API are separate Railway services
- Railway auto-deploys on git push (main branch)
- Ensure environment variables are set in Railway dashboard
- Database connection pooling handled by `@prisma/adapter-pg`
