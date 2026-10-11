# Item #02: Backend API Scaffold (Symfony 7.4 & Doctrine)

- Status: ✅ shipped
- Priority: P0 (Foundation)
- ADR: [ADR 0001](../../adr/0001-architecture-stack-and-workspace.md), [ADR 0006](../../adr/0006-postgresql-data-model-and-persistence.md)
- Verified: Symfony 7.4 installed with Doctrine ORM; connects to PostgreSQL on 5435; /api/health endpoint and test passing; PHPStan level 8 passing.

## Summary

Scaffold `apps/api` with Symfony 7.4, Doctrine ORM 3, Doctrine Migrations, PHPStan level 8, and PHPUnit 12. Connect to the containerized database on port 5435 and establish a health-check ping endpoint (`/api/health`).

## Acceptance Criteria

1. `apps/api/composer.json` contains dependencies for Symfony 7.4, Doctrine ORM, and testing utilities.
2. `php bin/console doctrine:query:sql "SELECT 1"` passes successfully against port 5435.
3. Health endpoint `GET /api/health` returns `{"status": "ok", "database": "connected"}`.
4. PHPStan and PHPUnit run cleanly.
