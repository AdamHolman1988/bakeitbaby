# 🍕 BakeItBaby

> **Precision Pizza Dough Calculator, Fermentation Planner & Flour Workbench**  
> A minimalistic, responsive, and bilingual web application designed for passionate pizza makers, home bakers, and pizzaiolos.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack: PHP + Next.js + PostgreSQL](https://img.shields.io/badge/Stack-PHP%20%7C%20Next.js%20%7C%20PostgreSQL-orange.svg)](#tech-stack)

---

## 💡 About BakeItBaby

**BakeItBaby** bridges artisan pizza tradition and food science into a clean, modern digital workbench. Instead of generic dough calculators that treat every flour the same, BakeItBaby factors in **Flour Strength ($W$ index)**, protein quality, ambient temperatures, and yeast types to give you exact baker's percentages and reliable fermentation schedules (room temperature vs. cold maturation).

Whether you are crafting a quick same-day direct dough, an authentic 65% Neapolitan, a 75%+ high-hydration Canotto, a Roman *pizza in teglia*, or a multi-day Biga/Poolish preferment, BakeItBaby calculates your ingredients to the exact gram and guides your fermentation timeline.

---

## ✨ Key Features

- **🧮 Precision Dough Calculator**:
  - Baker's percentage calculations based on desired dough ball count and weight.
  - Dynamic flour selection and multi-flour blending with automatic composite $W$ calculation.
  - Multi-yeast conversion: fresh compressed yeast, instant dry yeast, active dry yeast, and sourdough/lievito madre.
  - Adjustable hydration, salt %, olive oil %, and sugar/malt %.
  - Room temperature (RT) and cold fermentation (CT) maturation scheduler.

- **🌾 Flour Catalog with $W$-Strength Engine**:
  - Comprehensive flour database with $W$ strength index, protein %, flour type (`tipo 00`, `tipo 0`, Manitoba), and ideal hydration ranges.
  - Pre-seeded with authentic Italian & European flours (Caputo Cuoco, Caputo Pizzeria, Manitoba Oro, etc.).
  - Ability to add, edit, and curate your own custom flours.

- **📖 Interactive Recipe Book**:
  - Store, edit, and organize proven pizza recipes (Neapolitan, Canotto, Roman Crispy, Focaccia, Preferments).
  - One-click workflow: export any calculated dough directly into a saved recipe.
  - Full ingredient breakdowns and step-by-step fermentation steps.

- **🎨 Modern, Minimalist & Responsive UI**:
  - Full-width canvas optimized for large screens with zero cramped columns.
  - Fully responsive mobile drawer for tablet and smartphone access next to the oven.
  - Two distinct artisan themes:
    - **Light Mode**: *Modern & Vibrant* (Sand, Vibrant Orange, Basil Green, Deep Navy).
    - **Dark Mode**: *Modern Rustikál* (Deep Navy/Steel, Terracotta Red, Warm Mustard, Earth Green).
  - Open-source typography: *Outfit* (bold headlines) paired with *Plus Jakarta Sans* (clean readability).

- **🌍 Bilingual by Design (EN & CZ)**:
  - Instant one-click language switching between Czech (`cs`) and English (`en`) without losing calculator state.

---

## 🛠 Tech Stack

- **Backend**: PHP 8.4 + Symfony 7.4 (Doctrine ORM, Migrations, PHPUnit, PHPStan)
- **Frontend**: TypeScript + Next.js 16 (App Router, Turbopack, React 19, Tailwind CSS v4, `next-intl`, `next-themes`, Vitest)
- **Database**: PostgreSQL 17 (hosted via Docker on port `5435`)
- **Architecture**: Monorepo with Turborepo orchestration and GitHub Actions CI pipeline

---

## 📋 Flour Strength ($W$) Reference Guide

| Index $W$ | Strength | Ideal Hydration | Fermentation | Typical Uses |
|:---:|:---:|:---:|:---:|:---|
| **W 160–200** | Weak (*Slabá*) | 50–55 % | 2–4h (Room Temp) | Biscuits, grissini, quick thin doughs |
| **W 220–260** | Medium (*Střední*) | 55–60 % | 8–14h (Room Temp) | Same-day direct dough, quick pizza |
| **W 270–310** | Strong (*Silná*) | 60–70 % | 24–48h (Cold Ferment) | Classic Neapolitan pizza, focaccia |
| **W 320–380+** | Very Strong (*Manitoba*) | 70–85+ % | 48–72h (Cold Ferment) | Biga, poolish, high-hydration (75%+) |

---

## 📄 License

This project is open-source and released under the [MIT License](LICENSE).
