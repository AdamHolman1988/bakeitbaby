# ADR 0001: Architecture, Stack and Monorepo Workspace

- Status: Accepted
- Date: 2026-10-11
- Deciders: adamu, Antigravity
- Roadmap: `#01` — Workspace setup and foundational infrastructure

## Context

The Pizza application (BakeItBaby) requires a PHP backend, PostgreSQL database, and TypeScript frontend running locally on a developer PC with Docker Desktop. Other projects (such as `eshoptracker`) are already running in Docker on host ports 5433 and 8080, and the local host has a native PostgreSQL service listening on port 5432. The development workflow must guarantee zero port collisions, high developer ergonomics, and unified execution of linting, testing, and dev servers.

## Decision

1. **Workspace Layout**: The project is structured as a monorepo containing:
   - `apps/api`: PHP 8.4 backend using Symfony 7.4 (Doctrine ORM, migrations, Symfony CLI / built-in server).
   - `apps/web`: TypeScript frontend using Next.js 16 (App Router, Turbopack, React 19).
   - `compose.yaml`: Docker Compose file providing isolated local development dependencies.
2. **Database Container Port**: PostgreSQL 17 is hosted in Docker under container name `bakeitbaby-database`, exposed on host port `127.0.0.1:5435` with database `bakeitbaby`, credentials `bakeitbaby`/`bakeitbaby`. Ports 5432 and 5433 are forbidden to avoid clashes with the host system and other project containers.
3. **Workspace Tooling**: Root `package.json` configures npm workspaces and Turborepo (`turbo`) to orchestrate frontend build, test, and lint tasks, alongside composer scripts for the backend.
4. **API Communication**: The frontend interacts with `apps/api` via REST JSON endpoints under `/api/*`, configured with CORS for local development origins.

## Consequences

- Requires Docker Desktop to be running when starting the database container (`docker compose up -d database`).
- Running `apps/api` requires PHP 8.4 and Composer locally or in container, while `apps/web` requires Node 22+.
- Developers must use port `5435` in their `.env.local` database connection strings rather than default `5432`.
