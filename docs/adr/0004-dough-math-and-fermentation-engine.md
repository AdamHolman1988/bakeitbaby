# ADR 0004: Dough Mathematics and W-Strength Fermentation Engine

- Status: Accepted
- Date: 2026-10-11
- Deciders: adamu, Antigravity
- Roadmap: `#04` — Dough mathematics and fermentation engine

## Context

A pizza dough calculator must accurately compute ingredient weights from desired pizza quantities and ball weights using baker's percentages (where flour weight represents 100%). Furthermore, flour strength (Alveograph index $W$) directly dictates water absorption capacity and fermentation maturation limits (enzymatic breakdown vs gluten degradation) as documented in professional bakery literature (SFBI and The Fresh Loaf). The user requires explicit dough strength integration with real-time feedback.

## Decision

1. **Baker's Percentages Standard**:
   $$\text{Total Dough Weight} = \text{Pizzas Count} \times \text{Ball Weight (g)}$$
   $$\text{Total Percentage} = 100\% + \text{Hydration}\% + \text{Salt}\% + \text{Yeast}\% + \text{Oil}\% + \text{Sugar}\%$$
   $$\text{Flour Weight (g)} = \frac{\text{Total Dough Weight}}{\text{Total Percentage} / 100}$$
   $$\text{Ingredient Weight (g)} = \text{Flour Weight (g)} \times (\text{Ingredient}\% / 100)$$

2. **Yeast Equivalencies**:
   - Fresh compressed yeast (*čerstvé droždí*): Base ratio $1.0\times$
   - Instant dry yeast (*instantní sušené droždí*): Ratio $0.33\times$ (divide fresh yeast by 3)
   - Active dry yeast (*aktivní sušené droždí*): Ratio $0.5\times$ (divide fresh yeast by 2)
   - Sourdough / Lievito Madre (*kvásek / tuhý kvas*): Expressed as % of total flour (default 15–20%), factoring water and flour from starter into total hydration calculations.

3. **Flour Strength ($W$) Canonical Tiers**:
   - **Tier 1 (W 160–200)**: Slabá (Weak). Ideal hydration 50–55%. Maturation 2–4 hours at room temp (RT ~20–22°C). Suitable for biscuits, grissini, quick thin sheets.
   - **Tier 2 (W 220–260)**: Střední (Medium). Ideal hydration 55–60%. Maturation 8–14 hours at RT. Suitable for same-day direct dough pizza.
   - **Tier 3 (W 270–310)**: Silná (Strong). Ideal hydration 60–70%. Maturation 24–48 hours (RT + cold maturation CT ~4°C). Suitable for classic Neapolitan pizza and focaccia.
   - **Tier 4 (W 320–380+)**: Velmi silná / Manitoba (Very Strong). Ideal hydration 70–85+%. Maturation 48–72 hours cold fermentation (CT). Suitable for Biga, Poolish, and high-hydration doughs (75%+).

4. **Flour Blend Formula**: When combining multiple flours:
   $$W_{\text{composite}} = \frac{\sum (W_i \times \text{weight}_i)}{\sum \text{weight}_i}$$
   The calculator dynamically derives the composite $W$ rating and alerts if the chosen hydration or planned fermentation time exceeds or undercuts the flour's physical capabilities.

5. **Dual Implementation**: The core mathematical rules are implemented as a pure TypeScript utility in `apps/web/src/domain/calculator` for instant reactive UI updates and mirrored in PHP `apps/api/src/Domain/Calculator` with identical unit test vectors to ensure consistency when saving recipes.

## Consequences

- The user cannot select unrealistic fermentation times without receiving a clear visual warning from the W-index validator.
- Sourdough hydration recalculation requires tracking starter hydration (default 100% liquid levain or 50% pasta madre) so total water remains accurate.
