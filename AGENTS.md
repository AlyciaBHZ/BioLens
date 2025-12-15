# Repository Guidelines

## Project Structure
- `index.tsx` boots React; `App.tsx` owns SPA routing and page composition.
- `components/` UI pages/layout (e.g., `LandingPage.tsx`, `PatientView.tsx`, `ClinicianView.tsx`).
- `services/` client-side helpers and mock data (see `services/mockData.ts`).
- `public/` static assets served as-is.
- `vite.config.ts` Vite configuration (including GitHub Pages `base`).
- Build output goes to `dist/` (generated; ignored by git).

## Build, Test, and Development Commands
- `npm install` installs dependencies for local development.
- `npm run dev` starts the Vite dev server (configured for port `3000`).
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.
- CI/GitHub Pages uses `npm ci` + `npm run build` (Node `22`).

## Coding Style & Naming Conventions
- TypeScript + React function components; keep components small and focused.
- Formatting: 2-space indentation, single quotes, semicolons (match existing files).
- Naming: `PascalCase.tsx` for React components, `camelCase.ts` for utilities/services.
- Imports: the `@/` alias maps to the repo root for cleaner paths.

## Testing Guidelines
- No automated test runner is configured yet. If you add one, prefer `vitest` + React Testing Library.
- Suggested naming: `Component.test.tsx` next to the component or under `__tests__/`.

## Configuration & Security
- Local env lives in `.env.local` (set `GEMINI_API_KEY=...`).
- `vite.config.ts` exposes `GEMINI_API_KEY` to the client bundle; treat it as public and use restricted keys or a server-side proxy for sensitive credentials.
- GitHub Pages base path is `/BioLens/` in production; update `vite.config.ts` if the repo name changes.

## Commits & Pull Requests
- Commit messages in this repo are short and lowercase (e.g., `initial`, `pages`); keep messages concise and imperative.
- PRs: include a clear description, link issues if applicable, and add screenshots for UI changes.
