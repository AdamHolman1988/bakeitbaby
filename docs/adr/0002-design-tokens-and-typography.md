# ADR 0002: Design Tokens, Typography and Color Palettes

- Status: Accepted
- Date: 2026-10-11
- Deciders: adamu, Antigravity
- Roadmap: `#02` — Design system and token architecture

## Context

The UI must deliver a minimalistic design with exceptional readability while embodying authentic pizza aesthetics across light and dark modes. The brand identity specifies two distinct color philosophies from the project palette guide and a modern, dynamic typographical pairing.

## Decision

1. **Typography Pairing**:
   - Headings & Displays: `Outfit` (Google Fonts, weights 500, 600, 700, 800) for energetic, modern headlines.
   - Body & Interface Text: `Plus Jakarta Sans` (Google Fonts, weights 400, 500, 600, 700) for high legibility, clean numbers, and technical readability.
2. **Light Mode Palette ("Moderní & Vibrant")**:
   - Canvas / Surface Base: `Sand` (`#F6F3EB` / `#EFE9DB`)
   - Primary Accent / Action: `Vibrant Orange` (`#F25C05`)
   - Secondary Accent / Quality: `Basil Green` (`#2D6A4F` / `#3E7B5E`)
   - Deep Elements & Strong Contrast: `Navy` (`#1A2536`)
   - Muted Text & Borders: `Dark Grey` (`#4A5568` / `#2D3748`)
3. **Dark Mode Palette ("Moderní Rustikál")**:
   - Canvas / Surface Base: `Deep Navy / Steel` (`#151C24` / `#1C2430`)
   - Primary Accent / Warmth: `Terracotta Red` (`#C45535` / `#B84A2A`)
   - Highlights & Yeast Cues: `Mustard` (`#DDA15E` / `#E5A83B`)
   - Earthy Accents: `Earth Green` (`#4A6B53` / `#5C7D64`)
   - Text & Crisp Contrast: `Sand-Grey` (`#E6E2D8` / `#CBC5B8`)
4. **Implementation Standard**: All colors are exposed via CSS custom variables (`--bg`, `--card`, `--primary`, `--secondary`, `--accent`, `--text-main`, `--text-muted`, `--border`) integrated with Tailwind CSS v4 and `next-themes` class switching (`light` vs `dark`). Hardcoded hex values inside components are strictly prohibited.

## Consequences

- Web fonts must be loaded via Next.js `next/font/google` with `display: swap` to ensure fast initial paint without layout shifts.
- Any new component must consume semantic CSS variables rather than raw Tailwind color utilities like `bg-blue-500`.
