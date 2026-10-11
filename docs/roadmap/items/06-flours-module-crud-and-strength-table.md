# Item #06: Flours Module (Database, Seed Data, API & Management UI)

- Status: 🔲 todo
- Priority: P1 (Core Feature)
- ADR: [ADR 0004](../../adr/0004-dough-math-and-fermentation-engine.md), [ADR 0006](../../adr/0006-postgresql-data-model-and-persistence.md)

## Summary

Build the Flours management module: PostgreSQL database schema, Doctrine entity and migrations, pre-seeded flour catalog (Caputo Pizzeria, Cuoco, Manitoba, Babiččina volba pizza, etc.), REST API endpoints, and a responsive frontend interface allowing users to browse, search, add, and edit flours.

## Acceptance Criteria

1. Database schema holds flour name, brand, W-index (or range), protein %, type (00, 0, manitoba), ideal hydration range, recommended fermentation hours, and usage notes.
2. REST endpoints `GET /api/flours`, `POST /api/flours`, `PUT /api/flours/{id}`, `DELETE /api/flours/{id}` with validation.
3. Frontend Flours page displays a filterable card/table view with W-index strength badges (Weak, Medium, Strong, Manitoba).
4. Users can open an "Add Flour" or "Edit Flour" modal to create or update their own flours.
5. Unit and functional tests cover flour entity validation and API endpoints.
