# RP MVP

Full-stack Next.js (App Router) application with Better Auth and Drizzle ORM.

## Architecture

The project is organized by responsibility to keep growth manageable:

```text
src/
  app/                  # Next.js routes, layouts, route handlers
  features/             # Feature modules (auth, etc.)
    auth/
      client/           # Browser-side auth client
      server/           # Server actions / server-only auth logic
      ui/               # Feature-specific UI
  widgets/              # Reusable page sections (header, side panels, etc.)
  components/ui/        # Shared design-system primitives (shadcn-based)
  server/               # Server infrastructure (auth, db, schema)
  lib/                  # Shared cross-layer helpers (pure utilities)
```

### Layering rules

- `app` composes features/widgets, but does not store business logic.
- `features/*/server` and `server/*` are server-only modules.
- Shared UI primitives stay in `components/ui`.
- Domain/business growth should happen in `features/*` first.

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

```bash
pnpm lint
pnpm build
pnpm db:gen
pnpm db:migrate
pnpm db:studio
```
