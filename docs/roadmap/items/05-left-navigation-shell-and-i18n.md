# Item #05: Left-Sided Navigation Shell and Bilingual i18n (CZ/EN)

- Status: ✅ shipped
- Priority: P0 (UX Foundation)
- ADR: [ADR 0003](../../adr/0003-navigation-and-layout-hierarchy.md), [ADR 0005](../../adr/0005-internationalization-strategy.md)
- Verified: Left sidebar with strict order (1. Calculator, 2. Recipes, 3. Flours); wide canvas layout; mobile drawer; cs/en translations; Vitest test passing.

## Summary

Build the responsive wide layout shell with a left-sided persistent/collapsible sidebar adhering strictly to the user-specified navigation order:
1. **Calculator** (`/` or `/calculator`)
2. **Recipes** (`/recipes`)
3. **Flours** (`/flours`)
Implement bilingual support (`cs` and `en`) with `next-intl`.

## Acceptance Criteria

1. Navigation sidebar is anchored on the left and displays the three items in exact order: Calculator, Recipes, Flours.
2. Layout expands wide from left to right on desktop displays (`max-w-none` fluid container) while collapsing to a clean drawer on mobile/tablet viewports.
3. Language toggle in navigation switches all UI labels between Czech and English instantaneously.
4. Unit/component tests verify navigation rendering and translation dictionary coverage.
