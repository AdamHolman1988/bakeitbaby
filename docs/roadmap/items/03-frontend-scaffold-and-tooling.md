# Item #03: Frontend Scaffold (Next.js 16, Turbopack, TypeScript)

- Status: ✅ shipped
- Priority: P0 (Foundation)
- ADR: [ADR 0001](../../adr/0001-architecture-stack-and-workspace.md), [ADR 0002](../../adr/0002-design-tokens-and-typography.md)
- Verified: Next.js 16 App Router with Turbopack, React 19, TypeScript, Vitest, Outfit & Plus Jakarta Sans configured and building cleanly.

## Summary

Scaffold `apps/web` with Next.js 16 (App Router, Turbopack, React 19, TypeScript), Tailwind CSS v4, Lucide icons, Vitest 4, and `@testing-library/react`. Configure Google Fonts for `Outfit` and `Plus Jakarta Sans`.

## Acceptance Criteria

1. `apps/web` starts successfully with `npm run dev` (Turbopack).
2. Fonts `Outfit` (headlines) and `Plus Jakarta Sans` (body text) load cleanly.
3. Vitest test runner runs and passes sample tests.
4. Tailwind CSS v4 compiles utility classes without warning.
