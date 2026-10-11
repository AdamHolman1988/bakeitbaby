# Item #09: CI/CD Pipeline and Automated Testing Matrix

- Status: 🔲 todo
- Priority: P1 (Quality & DevOps)
- ADR: [ADR 0007](../../adr/0007-testing-strategy-and-ci-cd.md)

## Summary

Set up GitHub Actions CI/CD workflows and local test orchestrator scripts to run static analysis, typechecking, backend PHPUnit tests, frontend Vitest tests, and build checks automatically on every commit/PR.

## Acceptance Criteria

1. `.github/workflows/ci.yml` defined with parallel jobs:
   - `backend`: PHP 8.4 setup, composer validation, PHPStan analysis, PHPUnit test suite.
   - `frontend`: Node 22 setup, ESLint, TypeScript `tsc --noEmit`, Vitest test suite, Next.js production build.
2. Local script `./scripts/test-all.sh` runs all checks locally in one command.
3. All tests pass locally and in CI.
