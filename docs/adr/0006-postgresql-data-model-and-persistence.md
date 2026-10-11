# ADR 0006: PostgreSQL Data Model, Entities and Migrations

- Status: Accepted
- Date: 2026-10-11
- Deciders: adamu, Antigravity
- Roadmap: `#06` — Data persistence and schema architecture

## Context

The user must have complete freedom to view, add, and edit flours and pizza recipes. All data must persist in PostgreSQL using relational schema constraints, with complete support for multi-flour blends in recipes and audit timestamps.

## Decision

1. **Database Schema & Migrations**:
   - Managed via Doctrine ORM with Doctrine Migrations in `apps/api/migrations`. Direct unchecked DDL execution in production is prohibited.
   - Foreign keys with `ON DELETE CASCADE` or `RESTRICT` are enforced for referential integrity.
2. **Core Relational Model**:
   - `flours`:
     - `id` (UUIDv7 or INT auto-increment)
     - `name` (VARCHAR 128)
     - `brand` (VARCHAR 128, nullable)
     - `w_index` (SMALLINT, e.g. 260)
     - `w_range_max` (SMALLINT, nullable, for ranges like 280-320)
     - `protein_percentage` (NUMERIC(4, 1), e.g. 12.5)
     - `flour_type` (VARCHAR 32, e.g. `tipo_00`, `tipo_0`, `manitoba`, `t530`)
     - `min_hydration` (SMALLINT, default 55)
     - `max_hydration` (SMALLINT, default 65)
     - `recommended_fermentation_hours` (VARCHAR 64, e.g. "8-14h RT" or "24-48h CT")
     - `usage_tags` (JSONB / text, e.g. `["neapolitan", "direct", "quick"]`)
     - `notes` (TEXT, nullable)
     - `is_preset` (BOOLEAN, true for built-in library flours)
     - `created_at`, `updated_at` (TIMESTAMPTZ)
   - `recipes`:
     - `id` (UUIDv7 or INT auto-increment)
     - `name` (VARCHAR 160)
     - `description` (TEXT, nullable)
     - `pizza_style` (VARCHAR 64, e.g. `neapolitan`, `canotto`, `roman_crispy`, `focaccia`, `new_york`)
     - `preferment_type` (VARCHAR 32, e.g. `direct`, `biga`, `poolish`, `sourdough`)
     - `dough_balls_count` (SMALLINT, default 4)
     - `ball_weight_grams` (SMALLINT, default 260)
     - `hydration_percentage` (NUMERIC(4, 1), e.g. 65.0)
     - `salt_percentage` (NUMERIC(4, 2), e.g. 2.8)
     - `yeast_percentage` (NUMERIC(4, 3), e.g. 0.15)
     - `yeast_type` (VARCHAR 32, `fresh`, `instant_dry`, `active_dry`, `sourdough`)
     - `oil_percentage` (NUMERIC(4, 2), default 0.0)
     - `sugar_percentage` (NUMERIC(4, 2), default 0.0)
     - `fermentation_rt_hours` (NUMERIC(4, 1), room temperature duration)
     - `fermentation_ct_hours` (NUMERIC(4, 1), cold temperature fridge duration)
     - `instructions_json` (JSONB, step-by-step guidance)
     - `created_at`, `updated_at` (TIMESTAMPTZ)
   - `recipe_flour_blends`:
     - `id` (auto-increment)
     - `recipe_id` (FK -> recipes.id)
     - `flour_id` (FK -> flours.id)
     - `percentage` (NUMERIC(5, 2), e.g. 80.0 for 80% Caputo Pizzeria + 20% Manitoba)
3. **Data Seeding**: An automated doctrine fixtures / seeder script pre-loads canonical Italian and Czech flours (Caputo Pizzeria W260, Caputo Cuoco W300, Caputo Nuvola W270, Caputo Manitoba Oro W380, Babiččina Volba Hladká na pizzu W230, etc.) and proven benchmark recipes (AVPN Classic Neapolitan, High-Hydration Canotto, Roman Teglia, Overnight Sourdough Pizza).

## Consequences

- Deleting a flour that is bound to existing recipes must be prevented or handled via soft delete / warning in the UI.
- All numbers are stored as exact numeric decimals in SQL rather than floating point numbers to avoid rounding discrepancies in baker's arithmetic.
