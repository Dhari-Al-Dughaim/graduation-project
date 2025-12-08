# Agent Role: Laravel + Inertia React (TypeScript, Tailwind, shadcn) Expert

## Project Map
- Laravel backend in `app/` with HTTP routes in `routes/web.php` and API routes in `routes/api.php`; providers/config live in `config/`.
- Database assets: migrations/seeders in `database/`, factories in `database/factories/`.
- Inertia React TypeScript code sits under `resources/js/` (pages in `Pages/`, shared UI in `Components/` or `features/`); shared styles/assets live in `resources/` (including `css/`, `images/`).
- Tests mirror code paths in `tests/`; Pest is available via `pestphp/pest-plugin-laravel`.
- Build outputs go to `public/` via Vite; runtime caches in `bootstrap/cache/` and storage in `storage/` (keep writable).

## Development & Tooling
- Setup: `composer install`, `npm install`, copy `.env` from `.env.example`, then `php artisan key:generate`.
- Local dev: `composer run dev` for Laravel server/queue/logs/Vite; `npm run dev` for frontend-only, `npm run build` or `npm run build:ssr` for production bundles.
- Quality gates: `php artisan test`, `npm run lint`, `npm run types`, `npm run format:check`, PHP style via `vendor/bin/pint`.

## Backend Practices
- Follow PSR-12/PSR-4, typed properties/returns, feature-grouped classes under `App\`.
- Route controllers through clear, single-responsibility actions; API resources and form requests for validation/shape.
- Use database factories/seeders for predictable data; eager-load to avoid N+1; paginate server responses.
- Keep Inertia responses lean: return only data needed by the page, shape with resources/DTOs where helpful.

## Frontend (Inertia React + TS) Practices
- Type all page props and component contracts; centralize types for shared models.
- Use Inertia `useForm`/`router` for mutations and navigation; rely on server-driven validation errors.
- Organize by feature: pages under `resources/js/Pages`, shared UI/layout in `resources/js/Components` (or `ui/` for shadcn primitives), utilities/hooks in `lib/` or `hooks/`.
- Prefer shadcn components as building blocks; keep Tailwind classes minimal and consistent (Prettier Tailwind ordering).
- Keep layout/state logic in components; avoid inline styles; theme via CSS variables/Tailwind tokens; ensure accessible labels, focus states, and keyboard behavior.

## Styling & UX
- Tailwind first, with co-located styles; avoid global overrides unless necessary.
- Compose shadcn primitives instead of duplicating styles; extend via `className` and variant utilities.
- Maintain responsive layouts and sensible defaults for dark/light contexts if present; avoid motion that blocks interaction.

## Testing
- Prefer Pest for new tests; descriptive names like `it_creates_a_user`.
- Cover Inertia flows with Laravel feature tests (status, props shape, redirects, validation); add unit/utility tests as needed.
- Seed with factories for deterministic scenarios; verify auth/authorization, validation, and query correctness on new paths.

## Git, PRs, and Hygiene
- Commits: concise present-tense subjects (<72 chars); explain the why in the body when non-trivial; group related changes.
- PRs: include summary, commands run, environment notes, and screenshots/GIFs for UI changes; link routes or fixtures for reviewers.
- Do not commit `.env`, storage artifacts, or build outputs; add new env keys to `.env.example`.

## Security & Operations
- Keep secrets out of VCS; configure via `.env` locally and platform configs in deployed environments.
- On deploys: regenerate app key when needed, run `php artisan migrate --force`, and ensure required queues/listeners (`php artisan queue:listen`) are running.
