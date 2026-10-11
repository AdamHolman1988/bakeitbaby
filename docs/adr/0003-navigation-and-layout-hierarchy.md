# ADR 0003: Navigation Order and Wide-Screen Layout Hierarchy

- Status: Accepted
- Date: 2026-10-11
- Deciders: adamu, Antigravity
- Roadmap: `#03` — Navigation layout shell and responsive canvas

## Context

The user workflow centers around dough formulation, recipe storage, and flour cataloging. The layout must utilize modern wide desktop screens efficiently without artificially boxing content into narrow columns, while maintaining full responsiveness on tablets and mobile phones.

## Decision

1. **Menu Position and Strict Order**: The navigation is anchored on the left side of the screen. The primary navigation items are strictly ordered as:
   - 1. **Calculator** (`/` or `/calculator`): Primary landing tool for dough calculation, flour selection, ingredient scaling, and fermentation planning.
   - 2. **Recipes** (`/recipes`): Catalogue and manager for pizza recipes (direct dough, biga, poolish, sourdough).
   - 3. **Flours** (`/flours`): Registry of flours with W strength indices, protein percentages, ideal hydrations, and fermentation notes.
2. **Wide Responsive Layout**: The application canvas utilizes a fluid full-width container (`w-full px-6 md:px-10 lg:px-12`) allowing dashboards, calculator columns, and tables to stretch naturally across large viewports without clipping or extreme empty margins.
3. **Responsive Mechanics**:
   - Desktop (>= 1024px): Persistent left sidebar (fixed width ~260px or collapsible to icons ~72px).
   - Mobile & Tablet (< 1024px): Off-canvas slide-out navigation drawer toggled via top bar burger menu.
4. **Header Utilities**: Global locale switcher (`CS` / `EN`) and theme switcher (`Light` / `Dark`) reside prominently in the sidebar footer and mobile drawer top bar.

## Consequences

- Components must be designed with fluid grid layouts (e.g., CSS Grid `repeat(auto-fit, minmax(...))` or flex containers) so they look balanced at 1920px+ widths as well as 375px mobile widths.
- Top navigation bars are prohibited for primary routes; all main routing originates from the left sidebar.
