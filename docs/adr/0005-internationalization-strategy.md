# ADR 0005: Frontend and Backend Internationalization (i18n) Strategy

- Status: Accepted
- Date: 2026-10-11
- Deciders: adamu, Antigravity
- Roadmap: `#05` — Internationalization and bilingual catalogs

## Context

The application serves both Czech (`cs`) and English (`en`) speakers. Terminology for baking (e.g., *hydratace*, *droždí*, *síla mouky*, *fermentace*, *baker's percentage*, *poolish*, *biga*) has precise equivalents in both languages. Text must never be hardcoded into components.

## Decision

1. **Supported Locales**: Exactly two locales are supported: `cs` (default) and `en`.
2. **Frontend Engine**: Handled via `next-intl` utilizing structured JSON message files:
   - `apps/web/messages/cs.json`
   - `apps/web/messages/en.json`
3. **Locale Persistence**: User locale preference is saved in a lightweight cookie `NEXT_LOCALE` and synced with client state. A single-click selector in the sidebar footer switches languages instantly without reloading the whole page or losing calculator input values.
4. **Backend Contracts**: The PHP API returns localized field labels where applicable and structured translation keys (`error.flour_not_found`, `validation.hydration_out_of_range`) allowing the frontend to render localized user-facing feedback.
5. **Database Seed Data**: Default recipes and flours include bilingual names and descriptions (either via JSON column `{"cs": "...", "en": "..."}` or locale fallback fields).

## Consequences

- All UI strings must be added to both `messages/cs.json` and `messages/en.json`. Missing keys will be caught by TypeScript and linting checks.
- Date and time formatting must use Intl `Intl.DateTimeFormat` and number formatters `Intl.NumberFormat` with the active locale.
