Commit after every prompt until I explicitly ask you to.


# Proclaim Canada – Workspace Instructions

Church/Synagogue & Preacher matching platform. MVP phase 1 complete (March 2026).

## Code Style

- **TypeScript**: Strict mode, explicit types (avoid `any`)
- **React**: Functional components with hooks; prefer Tailwind for styling
- **File naming**: camelCase for functions/variables, PascalCase for components and types
- **Imports**: Group by external, then internal (e.g., `lib/`, `components/`); use `@/` alias for absolute imports
- **Validation**: Zod schemas for request/response validation; see `lib/utils.ts` for helpers
- **Environment variables**: Always use `.env.local` pattern; never commit secrets (see `.env.example`)

## Architecture

### Core Services

- **Authentication (NextAuth.js)**: JWT-based, roles PREACHER/CHURCH/ADMIN; see `lib/auth.ts`
- **Database (Prisma/PostgreSQL)**: 13 models covering users, profiles, listings, applications, messages, ratings
- **API Routes (Next.js)**: Route-based handlers in `app/api/`; middleware in `lib/subscription-middleware.ts`
- **Frontend (React 19)**: Page-based structure in `app/`; dashboard layouts in `app/dashboard/`, `app/church-dashboard/`

### Ownership & Authorization

- Church listings: Only church owner can view/edit applications
- Preacher applications: Only applicant can withdraw
- Always validate `session.user.id` before database operations
- Use role-based checks for admin endpoints (`/api/admin/*`)

See [architecture docs](../docs/IMPLEMENTATION_COMPLETE.md) for feature breakdown.

## Build and Test

### Essential Commands

```bash
npm run dev                # Start dev server (http://localhost:3000)
npm run build              # Production build
npm run lint               # Run Next.js linter
npm test                   # Run Jest tests
npm run test:integration   # Integration tests only (--runInBand)
npm run test:coverage      # Coverage report
npx prisma db push         # Apply schema changes
npx prisma studio         # Visual DB editor
```

### Database Setup

1. Create PostgreSQL database (e.g., `proclaim_canada`)
2. Set `DATABASE_URL` in `.env.local`
3. Run `npx prisma db push`
4. (Optional) Run seed scripts: `npm run seed-preachers`, `npm run seed-availability`

### Testing

- **Jest config**: `jest.config.ts` with ts-jest, 30-second timeout
- **Test structure**: `tests/` folder with `helpers.ts` (test users), `setup.ts` (mocks)
- **Integration tests**: `tests/integration/*.test.ts` use supertest + real DB
- **Test users**: Pre-defined in `tests/helpers.ts` (preacher1, preacher2, church1, church2)
- Run with `--runInBand` to prevent DB conflicts (already in npm script)

⚠️ **Never commit test database state**—tests use real PostgreSQL; use `DATABASE_URL_TEST` if separating test/dev DBs.

## Conventions

### Listing Status Flow

- `OPEN` → `IN_PROGRESS` (preacher applied) → `FILLED`/`CANCELLED`
- Church sets application status: `PENDING` → `ACCEPTED`/`REJECTED`
- Preacher can `WITHDRAW` before church accepts

### API Response Format

All endpoints return JSON with optional `error` field:
```typescript
{ success: true, data: {...} }
{ success: false, error: "message" }
```

### Service Types

5 fixed types: `SERMON`, `SPECIAL_SERVICE`, `REVIVAL`, `WORKSHOP`, `OTHER`

### Prisma Conventions

- Use `@default(now())` for timestamps
- Always include `createdAt`, `updatedAt` for audit trails
- Soft deletes: Use `deletedAt: DateTime?` rather than removing records
- Indexes on frequently queried fields: `userId`, `email`, `status`

## Key Gotchas

1. **NextAuth session**: Call `getSession()` server-side; client uses `useSession()` from `SessionProvider`
2. **Prisma `unique` fields**: Cannot have `null` values in duplicate checks; use partial indexes for soft deletes
3. **Email sending**: Currently logs to console in dev mode; set up SMTP in `.env.local` for production (see `.env.example`)
4. **Search performance**: Full-text search on title/description can be slow with large datasets; consider PostgreSQL `tsvector` for optimization
5. **Form validation**: Always validate on both client (React) and server (Zod) to prevent bypass
6. **Role enum in schema**: If changing roles, update `UserRole` enum in `prisma/schema.prisma` and regenerate client

## Related Documentation

- [Testing Guide](../TESTING.md) – Detailed integration test setup and examples
- [Implementation Status](../docs/IMPLEMENTATION_COMPLETE.md) – Feature checklist and roadmap
- [Service Type Selector](../docs/SERVICE_TYPE_SELECTOR.md) – UI component reference
- Build scripts in [package.json](../package.json)
- Database schema in [prisma/schema.prisma](../prisma/schema.prisma)

## Next Priority Features

1. Messaging system (model exists, routes pending)
2. Availability calendar (slots model exists)
3. Ratings/reviews (Rating model exists)
4. Email notifications (SMTP configured in env)
5. Admin dashboard (`/api/admin/*` endpoints stubbed)
