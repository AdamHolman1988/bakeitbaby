# ADR 0007: Testing Strategy and CI/CD Pipeline

- Status: Accepted
- Date: 2026-10-11
- Deciders: adamu, Antigravity
- Roadmap: `#07` — Continuous integration and automated test coverage

## Context

The user specifies: *"We should go with ci/cd pipeline. Everything should be tested. I think backend and frontend."* Calculating dough hydration, baker's percentages, yeast conversions, and managing recipe CRUD operations require strict correctness. Mathematical regressions or invalid state transitions must be stopped before code lands on main.

## Decision

1. **Backend Testing & Quality Gates**:
   - Framework: PHPUnit 12.
   - Unit tests covering:
     - `DoughCalculator`: exact gram rounding, baker's percentages, yeast scaling for fresh vs dry vs active vs sourdough.
     - `FlourStrengthEvaluator`: W-index classification (Weak, Medium, Strong, Manitoba), hydration threshold boundary checks, fermentation duration matching.
     - `FlourBlendCalculator`: composite W calculation for multi-flour ratios.
   - Functional tests covering:
     - API controllers (`/api/flours`, `/api/recipes`, `/api/calculate`) with test database transactions.
   - Static analysis: PHPStan level 8 ensuring strict typing and null safety.
2. **Frontend Testing & Quality Gates**:
   - Framework: Vitest + `@testing-library/react` + `@testing-library/jest-dom`.
   - Unit tests for client domain math: identical calculation test vectors to the backend.
   - Component & Integration tests for:
     - `DoughCalculator`: slider/input manipulation, real-time recalculation of flour, water, yeast, salt, oil weights.
     - `FloursTable`: search, sort, filter by W strength, add/edit flour modal validation.
     - `RecipesList`: recipe cards, filter by style, save calculation as recipe.
     - `LanguageSwitcher` and `ThemeSwitcher`: locale switching and theme class toggling.
   - Static analysis: `tsc --noEmit` and `eslint`.
3. **CI/CD Pipeline**:
   - Orchestrated via GitHub Actions (`.github/workflows/ci.yml`).
   - Every push and pull request runs:
     - Job 1: Backend CI (PHP 8.4, Composer install, PHPStan, PHPUnit).
     - Job 2: Frontend CI (Node 22, npm ci, ESLint, TypeScript typecheck, Vitest, Next.js build).
4. **Local Verification**:
   - A root command (`npm test` / `./scripts/test-all.sh`) executes both backend and frontend test suites locally in under 30 seconds.

## Consequences

- PRs and commits cannot merge if test suites fail or code coverage drops on domain math.
- Local test environment requires SQLite in-memory or Docker PostgreSQL test database for functional API runs.
