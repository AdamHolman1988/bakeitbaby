# Item #10: Full End-to-End Verification, Performance & Documentation

- Status: 🔲 todo
- Priority: P2 (Polish & Documentation)
- ADR: [ADR 0001](../../adr/0001-architecture-stack-and-workspace.md)

## Summary

Conduct end-to-end user journey verification: creating a custom flour, using it in the Calculator to compute a dough batch, saving it as a custom recipe, viewing and updating the recipe, and switching languages and themes. Finalize project README runbook and quickstart scripts.

## Acceptance Criteria

1. End-to-end user workflow validated from UI down to PostgreSQL and back.
2. Complete README with single-command start (`docker compose up -d database && npm run dev`).
3. Verification report documenting test coverage and performance metrics.
