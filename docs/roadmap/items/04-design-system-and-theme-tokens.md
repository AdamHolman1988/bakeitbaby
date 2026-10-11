# Item #04: Design System and Theme Tokens (Vibrant Light & Rustic Dark)

- Status: 🔲 todo
- Priority: P0 (UI Foundation)
- ADR: [ADR 0002](../../adr/0002-design-tokens-and-typography.md)

## Summary

Implement CSS design tokens for Light Mode ("Moderní & Vibrant": Sand, Vibrant Orange, Basil Green, Navy, Dark Grey) and Dark Mode ("Moderní Rustikál": Deep Navy/Steel, Terracotta Red, Mustard, Earth Green, Sand-Grey) using `next-themes`.

## Acceptance Criteria

1. CSS variable design system defined in `apps/web/src/styles/globals.css`.
2. Toggle button switches between Light and Dark mode seamlessly with zero flash of unstyled content (FOUC).
3. Visual token swatch component or test verifying accurate color contrast and font hierarchy.
