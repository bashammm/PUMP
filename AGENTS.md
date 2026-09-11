# Base44 Dev Environment

## Stack
- **Runtime**: Node.js 22 (NOT Bun — `tsx` is incompatible with Bun's runtime)
- **Package manager**: npm (repo ships `bun.lock` but npm resolves fine from `package.json`)
- **Framework**: Vite 6 + React 19 frontend, Express backend in a single `server.ts` (single-origin, port 3000)
- **Dev command**: `npx tsx server.ts` — boots Express which mounts Vite in middleware mode

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
App is served on host port 3000. Vite HMR is disabled (`DISABLE_HMR=true`) to avoid flicker during edits; use `reload_preview` after backend changes.

## Environment / Secrets
- `GEMINI_API_KEY` — Google AI Studio key for the AI-powered contract-audit & pulse endpoints. **Optional at boot** (lazy-initialized); without a real key those endpoints return errors but the rest of the app works. Obtain from https://aistudio.google.com/apikey
- `SOL_RECIPIENT`, `GCP_PROJECT_ID`, `GCP_DEFAULT_ZONE` — have hardcoded defaults in `server.ts`, no setup needed
- `APP_URL` — referenced in `.env.example` but not used in code

## Verification
- `curl localhost:3000/` → HTML with `/@vite/client` (confirms live source, not prebuilt)
- `curl localhost:3000/api/flywheel/status` → JSON token/flywheel state

## Notes
- `package.json` lists `vite` in both `dependencies` and `devDependencies` (harmless npm warning)
- All app state is in-memory (no database) — restarts reset state
