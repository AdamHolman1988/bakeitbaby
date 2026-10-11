# Item #07: Pizza Dough Calculator and W-Strength Fermentation Engine

- Status: 🔲 todo
- Priority: P1 (Core Feature)
- ADR: [ADR 0004](../../adr/0004-dough-math-and-fermentation-engine.md)

## Summary

Build the primary Calculator view: interactive pizza dough calculator allowing flour selection (from database), number of pizzas, ball weight (g), hydration %, yeast type (fresh, instant dry, active dry, sourdough), salt %, oil/sugar %, and fermentation planning. Calculates exact ingredient gram weights and displays fermentation time guidance based on the selected flour's W-strength.

## Acceptance Criteria

1. Input parameters:
   - Flour selection dropdown / multi-flour blend
   - Number of dough balls & ball weight (g)
   - Hydration % (with dynamic recommended range indicator based on flour W)
   - Yeast type selection (fresh compressed, instant dry 33%, active dry 50%, sourdough/LM)
   - Salt % (default 2.8%)
   - Optional fat (olive oil %) and sugar/malt %
   - Fermentation parameters (room temperature °C, room proofing hours, cold fridge hours)
2. Outputs:
   - Exact gram weights for flour, water, yeast, salt, oil, and total dough mass.
   - Baker's percentage breakdown table.
   - Flour strength evaluation (warns if hydration or fermentation exceeds W-limits).
   - Fermentation timeline breakdown (bulk fermentation, ball proofing, cold maturation).
3. "Save as Recipe" action directly transfers computed parameters to the Recipe editor.
4. Comprehensive unit test suites verifying baker's arithmetic and W-strength boundary curves in both TypeScript and PHP.
