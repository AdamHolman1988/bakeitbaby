# Item #01: Monorepo Foundation and Containerized Database

- Status: ✅ shipped
- Priority: P0 (Foundation)
- ADR: [ADR 0001](../../adr/0001-architecture-stack-and-workspace.md)
- Verified: PostgreSQL 17 container healthy on 127.0.0.1:5435; root npm workspaces + Turborepo 2.4.4 configured.

## Summary

Scaffold the root monorepo with `compose.yaml` hosting PostgreSQL 17 on dedicated port `127.0.0.1:5435` with healthcheck. Configure root `package.json` with npm workspaces and Turborepo to unify commands across apps.

## Acceptance Criteria

1. Running `docker compose up -d database` launches PostgreSQL 17 on port 5435 without colliding with host 5432 or other docker containers on 5433.
2. Root `package.json` contains workspaces for `apps/*` and turbo pipeline scripts.
3. Database container is reachable via `pg_isready -h 127.0.0.1 -p 5435 -U bakeitbaby`.
