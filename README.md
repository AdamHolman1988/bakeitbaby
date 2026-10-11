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

**BakeItBaby** bridges artisan pizza tradition and food science into a quiet, clean, and minimalist digital workbench. Instead of generic dough calculators that treat every flour the same, BakeItBaby factors in:
- **Flour Strength ($W$ index)** & **Elasticity ($P/L$ ratio)**
- **Method Formulation**: Direct Dough (*Přímé těsto*), **Biga** (45% stiff preferment), and **Poolish** (1:1 liquid preferment) with exact two-phase ingredient schedules.
- **Top 3 Recommended Flours** for each pizza style (*Klasická Neapol*, *Contemporary / Canotto*, *Římská plech / Teglia*, *Bezlepková / Gluten-Free*, *Rychlá na dnes*).
- **Separation of Concerns**: Saved dough blueprints (**Těsta**) vs. full pizza cookbook recipes (**Recepty**) with toppings and oven parameters.

---

## ✨ Application Modules & Structure

- **🧮 1. Kalkulátor (Precision Dough Calculator)**:
  - **Method Selector**: Switch seamlessly between **Přímé těsto**, **Biga**, and **Poolish**.
  - **Two-Phase Calculation Breakdown**:
    - **Fáze 1 (Preferment)**: Exact flour, water, yeast, and temperature schedule (e.g. 1h RT + 16–24h fridge).
    - **Fáze 2 (Finální těsto)**: Remaining flour, cold/ice water, salt, oil/malt, and mixing instructions.
  - **Style Presets & Top 3 Recommended Flours**: One-click quick selection of the 3 best flours for each style.
  - Only flours enabled via *V kalkulátoru* appear in the calculator dropdown.

- **🧑‍🍳 2. Těsta (Dough Formulations Workbench)**:
  - Catalog of saved dough formulas (AVPN Neapolitan, Canotto 72%, 100% Biga, Poolish, Roman Teglia, Gluten-Free).
  - Baker's percentages, preferment ratios, room-temp (RT) and cold-temp (CT) fermentation schedules.
  - One-click button to reload any formulation back into the Calculator for batch re-scaling.

- **📖 3. Recepty (Pizza Kuchařka & Cookbook)**:
  - Full pizza recipes (Margherita Verace, Marinara Tradizionale, Diavola s 'Ndujou, Mortadella & Burrata & Pistácie, Quattro Formaggi, Bezlepková Margherita).
  - Ingredient & toppings lists divided by stage (*základ*, *před pečením*, *po upečení*).
  - Baking parameters: oven temperature (e.g. 450 °C pizza oven vs. 250 °C home oven) and baking time (seconds).
  - Optional link to a specific dough formula or standalone (*Vlastní těsto*).

- **🌾 4. Mouky (Flour Registry & Table)**:
  - **Single-row-per-flour compact table**: Brand, Name, Type, $W$ Index, Elasticity ($P/L$), Protein %, Hydration %, Maturation, and *V kalkulátoru* toggle switch.
  - Detailed slide-over/modal profile for technical usage notes, descriptions, and recommended recipes.
  - Pre-seeded with benchmark flours: **Caputo Nuvola Super** ($W\sim 330$, $P/L\sim 0.50\text{–}0.60$), **Caputo Fioreglut (Gluten-Free)**, Caputo Pizzeria, Caputo Cuoco, Manitoba Oro, Le 5 Stagioni, and Babiččina volba.

- **🎨 Minimalist, Calm & Readable UI**:
  - Artisan, quiet surfaces with subtle borders (no loud, disco-like neon outlines).
  - Dual themes: Light Mode (*Moderní & Vibrant Artisan*) and Dark Mode (*Moderní Rustikál*).
  - Typography: **Outfit** for headings and **Plus Jakarta Sans** for clear technical text.
  - Fluid wide layout with responsive navigation drawer for tablets and mobile devices.

- **🌍 Bilingual (CZ & EN)**:
  - Instant one-click language toggle between Czech (`cs`) and English (`en`) across all views.

---

## 📋 Flour Strength ($W$) & Elasticity ($P/L$) Reference Guide

| Index $W$ | Elasticita ($P/L$) | Síla (Strength) | Ideální hydratace | Zrání | Typické využití |
|:---:|:---:|:---:|:---:|:---:|:---|
| **W 160–200** | 0.50 | Slabá | 50–55 % | 2–4 h (RT) | Sušenky, grissini, rychlá tenká těsta |
| **W 220–260** | 0.50–0.60 | Střední | 55–62 % | 8–14 h (RT) | Rychlejší pizza na stejný den, přímé těsto |
| **W 270–310** | 0.50–0.60 | Silná | 60–70 % | 24–48 h (chlad) | Klasická neapolská pizza, focaccia |
| **W 320–380+** | 0.50–0.80 | Manitoba / Super Cloud | 70–85+ % | 48–72 h (chlad) | Contemporary Canotto, Biga, Poolish, hydratace 75%+ |
| **Bezlepková** | N/A | Bez lepku (Fioreglut) | 80–85 % | 3–24 h | Bezlepková pizza, focaccia pro celiaky |

---

## 🔒 Safe Port Allocation (Zero Host Collisions)

BakeItBaby runs safely alongside your other projects and native services:

| Service | Port | Notes |
|---|---|---|
| **PostgreSQL 17** | `127.0.0.1:5435` | Container `bakeitbaby-database` (avoids host 5432 and other docker 5433) |
| **Symfony 7.4 API** | `127.0.0.1:8001` | REST JSON backend (avoids port 8000/8080) |
| **Next.js 16 Web** | `http://localhost:3005` | Turbopack frontend (avoids port 3000) |

---

## 🚀 Quickstart & Global CLI Command

Run the global runner anytime from your terminal:
```bash
bakeitbaby
```
Or start the dev script directly:
```bash
./scripts/dev.sh
```

To run the complete automated test suite (database check, PHPStan level 8, PHPUnit, Vitest, and Next.js production build):
```bash
./scripts/test-all.sh
```

---

## 📄 License

This project is licensed under the **MIT License** — feel free to fork, customize, and share. See [LICENSE](LICENSE) for details.
