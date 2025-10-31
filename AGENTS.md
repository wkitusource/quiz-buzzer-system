# Repository Guidelines

## Project Structure & Module Organization
- Root uses pnpm plus Turborepo (`turbo.json` tracks task pipelines).
- `apps/api` contains the Express + Socket.IO backend with domain services in `src/services`, shared types in `src/types`, utilities in `src/utils`, and build output in `dist/`.
- `apps/web` is a Next.js 16 App Router client; routes live in `src/app`, global styles in `src/app/globals.css`, and static assets in `public/`.
- `packages` is reserved for future shared libraries; keep reusable code here instead of cross-importing between apps.
- Configure `.env` files to override defaults such as `PORT` and `CLIENT_URL`; never commit secrets.

## Build, Test, and Development Commands
- `pnpm install` bootstraps dependencies.
- `pnpm dev` runs the API watcher (`tsx watch src/index.ts`) and Next.js dev server; scope with `pnpm --filter api dev` or `pnpm --filter web dev`.
- `pnpm build` compiles all workspaces; add `--filter` for single targets (`pnpm --filter api build`, `pnpm --filter web build`).
- Quality gates: `pnpm lint`, `pnpm --filter api check-types`, and `pnpm format`.
- After building, `pnpm --filter api start` serves the compiled API.

## Coding Style & Naming Conventions
- TypeScript throughout; keep ES module syntax and rely on Prettier (`pnpm format`) for formatting.
- Use camelCase for variables/functions, PascalCase for React components, and kebab-case filenames (`game-service.ts`, `socket-handlers.ts`).
- Keep realtime business logic in `src/services` and share DTOs via `src/types` to avoid drift between API and web.
- Resolve ESLint (Next core-web-vitals profile) warnings before merging; justify any rule disablement in the PR.

## Testing Guidelines
- No automated suite ships yet; introduce one with your feature (Vitest + supertest for the API, React Testing Library or Playwright for the web are preferred).
- Place specs near the code (`apps/api/src/services/__tests__/room-service.test.ts`, `apps/web/src/app/__tests__/lobby.test.tsx`).
- Update each package’s `test` script and extend `turbo.json` with a `test` task when suites are added.
- Cover socket flows (room create/join/buzz ordering) and dependent UI before review.

## Commit & Pull Request Guidelines
- Use Conventional Commits `<type>(<scope>): <summary>` (see `feat(web): initialize Next.js application with Tailwind CSS and global styles`); align scopes to workspaces.
- Keep summaries imperative and under ~72 characters.
- PRs need a short description, linked issues, and proof of local verification (command output or UI capture for lobby updates).
- Prefer small, focused PRs; combine API and web changes only when release-coupled.
