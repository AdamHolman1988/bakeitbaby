# 🍕 BakeItBaby

> **Precision Pizza Dough Calculator, Fermentation Planner & Flour Workbench**  
> A minimalistic, responsive, and bilingual web application designed for passionate pizza makers, home bakers, and pizzaiolos.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/AdamHolman1988/bakeitbaby/actions/workflows/ci.yml/badge.svg)](https://github.com/AdamHolman1988/bakeitbaby/actions/workflows/ci.yml)
[![Stack: PHP 8.4 + Symfony 7.4](https://img.shields.io/badge/Backend-PHP%208.4%20%7C%20Symfony%207.4-8892BF.svg)](#tech-stack)
[![Stack: Next.js 16 + React 19](https://img.shields.io/badge/Frontend-Next.js%2016%20%7C%20React%2019-black.svg)](#tech-stack)
[![Database: PostgreSQL 17](https://img.shields.io/badge/Database-PostgreSQL%2017-336791.svg)](#tech-stack)

---

## 💡 About BakeItBaby

**BakeItBaby** bridges artisan pizza tradition and food science into a clean, modern digital workbench. Instead of generic dough calculators that treat every flour the same, BakeItBaby factors in **Flour Strength ($W$ index)**, protein quality, ambient temperatures, and yeast types to give you exact baker's percentages and reliable fermentation schedules (room temperature vs. cold maturation).

Whether you are crafting a quick same-day direct dough, an authentic 65% Neapolitan, a 72%+ high-hydration Canotto, a Roman *pizza in teglia*, or a multi-day Biga/Poolish preferment, BakeItBaby calculates your ingredients to the exact gram and guides your fermentation timeline.

---

## ✨ Features

- **🧮 1. Precision Dough Calculator**:
  - Baker's percentage calculations based on desired dough ball count and weight.
  - Dynamic flour selection from the database and custom flour parameter adjustments.
  - Multi-yeast conversion: fresh compressed yeast, instant dry yeast ($0.33\times$), active dry yeast ($0.5\times$), and sourdough/lievito madre ($15\%$).
  - Precise sliders for hydration, salt %, olive oil %, and sugar/malt %.
  - Room temperature (RT) and cold maturation (CT) fermentation breakdown scheduler.
  - Direct *"Save as Recipe"* workflow.

- **📖 2. Interactive Recipe Book**:
  - Browse, add, and edit tested pizza recipes (AVPN Neapolitan, Canotto, Roman Teglia, 100% Biga, Sourdough).
  - Detailed spec cards with baker's percentages, dough ball weights, and step-by-step preparation guides.
  - One-click button to load any recipe back into the Calculator for batch re-scaling.

- **🌾 3. Flour Catalog & $W$-Strength Engine**:
  - Comprehensive flour database with $W$ strength index, protein %, flour type (`tipo 00`, `tipo 0`, Manitoba), and ideal hydration ranges.
  - Pre-seeded with authentic Italian & European flours (Caputo Cuoco, Caputo Pizzeria, Caputo Nuvola, Manitoba Oro, Babiččina volba pizza, etc.).
  - Complete user freedom to create, edit, and organize custom flours.

- **🎨 Modern, Minimalist & Responsive UI**:
  - Left-sided navigation bar with strict menu order (**1. Calculator**, **2. Recipes**, **3. Flours**).
  - Wide-screen fluid canvas (`max-w-none`) optimized for large desktop displays and mobile drawer for kitchen tablets/phones.
  - Dual theme architecture:
    - **Light Mode ("Moderní & Vibrant")**: Sand canvas (`#F6F2E9`), Vibrant Orange (`#F25C05`), Basil Green (`#2D6A4F`), Deep Navy (`#152238`), Dark Grey text.
    - **Dark Mode ("Moderní Rustikál")**: Deep Navy/Steel (`#141A24`), Terracotta Red (`#C85234`), Mustard (`#E0A93B`), Earth Green (`#557A5E`), Sand-Grey text.
  - Open-source typography: **Outfit** (bold display headlines) paired with **Plus Jakarta Sans** (clean technical readability).

- **🌍 Bilingual by Design (EN & CZ)**:
  - Instant one-click language toggle between Czech (`cs`) and English (`en`) without losing calculator state.

---

## 📋 Flour Strength ($W$) Reference Guide

| Index $W$ | Strength / Síla | Ideal Hydration | Fermentation | Typical Uses |
|:---:|:---:|:---:|:---:|:---|
| **W 160–200** | Slabá (Weak) | 50–55 % | 2–4h (Room Temp) | Biscuits, grissini, quick thin doughs |
| **W 220–260** | Střední (Medium) | 55–60 % | 8–14h (Room Temp) | Same-day direct dough, quick pizza |
| **W 270–310** | Silná (Strong) | 60–70 % | 24–48h (Cold Ferment) | Classic Neapolitan pizza, focaccia |
| **W 320–380+** | Velmi silná (Manitoba) | 70–85+ % | 48–72h (Cold Ferment) | Biga, poolish, high-hydration (75%+) |

---

## 🔒 Safe Port Allocation (Zero Host Collisions)

BakeItBaby runs safely alongside your other projects and native services:

| Service | Port | Notes |
|---|---|---|
| **PostgreSQL 17** | `127.0.0.1:5435` | Container `bakeitbaby-database` (avoids host 5432 and other docker 5433) |
| **Symfony 7.4 API** | `127.0.0.1:8001` | REST JSON backend (avoids port 8000/8080) |
| **Next.js 16 Web** | `http://localhost:3005` | Turbopack frontend (avoids port 3000) |

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- Docker Desktop
- PHP 8.4+ CLI and Composer
- Node.js 22+ and npm

### 2. Start Development Environment
Run the all-in-one developer launcher:
```bash
./scripts/dev.sh
```
This automatically:
1. Starts the isolated PostgreSQL 17 container on port `5435`.
2. Runs database migrations and seeds flours & recipes.
3. Starts the Symfony API server on `http://127.0.0.1:8001`.
4. Starts the Next.js Turbopack web server on `http://localhost:3005`.

---

## 🧪 Testing & CI/CD Pipeline

BakeItBaby enforces strict automated testing across backend and frontend.

### Run All Tests Locally
```bash
./scripts/test-all.sh
```
Executes in under 15 seconds:
1. PostgreSQL container health verification.
2. PHPStan Static Analysis (Level 8, zero errors).
3. PHPUnit Test Suite (9 tests, 51 assertions).
4. Vitest Component & Domain Math Tests (5 suites, 7 tests).
5. Next.js Turbopack Production Build verification.

---

## 📂 Architecture & ADRs

All key design choices are documented in [Architecture Decision Records](docs/adr/README.md) and mapped in the [Delivery Roadmap](ROADMAP.md):

- [ADR 0001: Architecture, Stack and Monorepo Workspace](docs/adr/0001-architecture-stack-and-workspace.md)
- [ADR 0002: Design Tokens, Typography and Color Palettes](docs/adr/0002-design-tokens-and-typography.md)
- [ADR 0003: Navigation Order and Wide-Screen Layout Hierarchy](docs/adr/0003-navigation-and-layout-hierarchy.md)
- [ADR 0004: Dough Mathematics and W-Strength Fermentation Engine](docs/adr/0004-dough-math-and-fermentation-engine.md)
- [ADR 0005: Internationalization (i18n) Strategy](docs/adr/0005-internationalization-strategy.md)
- [ADR 0006: PostgreSQL Data Model, Entities and Migrations](docs/adr/0006-postgresql-data-model-and-persistence.md)
- [ADR 0007: Testing Strategy and CI/CD Pipeline](docs/adr/0007-testing-strategy-and-ci-cd.md)

---

## 📄 License

This project is open-source and released under the [MIT License](LICENSE).
