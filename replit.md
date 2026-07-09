# PropScan AI

AI-powered property document analysis app — users upload PDF property documents and get instant AI-generated summaries and risk reports.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/property-analyzer run dev` — run the frontend (port varies)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL` / `AI_INTEGRATIONS_OPENAI_API_KEY` — auto-set by Replit AI Integrations

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui (artifacts/property-analyzer)
- API: Express 5 (artifacts/api-server)
- DB: PostgreSQL + Drizzle ORM
- AI: OpenAI via Replit AI Integrations (gpt-5.4)
- PDF parsing: pdf-parse (externalized from esbuild bundle)
- File upload: multer (in-memory)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/db/src/schema/documents.ts` — Documents table schema
- `artifacts/api-server/src/routes/documents.ts` — Document upload, analysis, list, delete routes
- `artifacts/property-analyzer/src/` — React frontend
- `lib/api-client-react/src/generated/` — Generated React Query hooks (don't edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas (don't edit)

## Architecture decisions

- PDF text is extracted server-side via pdf-parse (externalized from esbuild due to ESM incompatibility)
- AI analysis runs asynchronously after document upload — the HTTP response returns immediately with status "processing", and the analysis happens in the background
- Documents are stored in Postgres; PDF binary is not persisted (only metadata + analysis)
- OpenAI GPT-5.4 analyzes documents and returns structured JSON (summary + risk items + overall risk level)
- Risk items have severity (low/medium/high) and category (e.g., Title, Financial, Legal, Environmental)

## Product

- Upload PDF property documents (title deeds, lease agreements, survey reports, contracts)
- Get AI-generated executive summary and structured risk analysis
- Dashboard with document list and risk statistics
- Drag-and-drop upload with click-to-browse support
- Color-coded risk severity (low/medium/high)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `pdf-parse` must be added to the `external` list in `artifacts/api-server/build.mjs` — it doesn't bundle cleanly in ESM
- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before using types
- DB push: `pnpm --filter @workspace/db run push` (not `migrate`)
- The `lib/db/src/schema/index.ts` must export all schema tables or they won't be picked up by drizzle-kit

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
