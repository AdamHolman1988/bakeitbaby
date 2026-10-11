# Item #08: Recipes Module (Database, API & Management UI)

- Status: 🔲 todo
- Priority: P1 (Core Feature)
- ADR: [ADR 0006](../../adr/0006-postgresql-data-model-and-persistence.md)

## Summary

Build the Recipes catalogue and management module: database entities and migrations for recipes and flour blends, pre-seeded authentic pizza recipes (AVPN Neapolitan, Canotto High Hydration, Roman Teglia, Biga 100%, Sourdough), REST API endpoints, and a responsive frontend UI to view, add, and edit recipes.

## Acceptance Criteria

1. Database schema holds recipes with styles, preferment types (direct, biga, poolish, sourdough), dough ball specs, baker's percentages, fermentation schedules, and flour blend associations.
2. REST endpoints `GET /api/recipes`, `POST /api/recipes`, `PUT /api/recipes/{id}`, `DELETE /api/recipes/{id}`.
3. Frontend Recipes page provides recipe cards with style badges, hydration preview, and ingredient summary.
4. Recipe detail modal/view displays step-by-step dough preparation timeline.
5. Users can add new recipes or edit existing recipes, including customizing the flour blend ratios.
6. Functional tests for recipe CRUD and blend relationships pass.
