# 🌌 Space Explorer (CSR)

A client-side rendered Angular gallery for NASA's **Astronomy Picture of the Day (APOD)**.

This is the **CSR variant** of [space-explorer](https://github.com/omairab2/space-explorer)
(which uses SSR + a server-side API proxy). Same UI and architecture, rendered entirely in
the browser.

![Angular](https://img.shields.io/badge/Angular-22-dd0031?logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![Rendering](https://img.shields.io/badge/rendering-CSR%20%2F%20SPA-8b5cf6)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)

## ✨ Features

- APOD gallery + detail view (image or embedded video)
- **Signals** (`toSignal()` / `computed()`), standalone components, lazy-loaded routes
- **Clean layered architecture** (core / infrastructure / presentation / shared)
- Resilient data layer (per-request `timeout` + `retry`)
- TailwindCSS v4

## 🏗️ Architecture

```
src/app/
├── core/             # Domain models & interfaces (Apod)
├── infrastructure/   # NasaApodService (HttpClient → NASA directly)
├── presentation/     # Pages & components (home, detail, apod-card, skeleton)
└── shared/           # Cross-cutting utils
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 24.x (Angular 22's CLI requires ≥ 22.22.3 or ≥ 24.15.0)
- **pnpm** ([install](https://pnpm.io/installation))
- A free **NASA API key** — [api.nasa.gov](https://api.nasa.gov)

### Setup

```bash
git clone https://github.com/omairab2/space-explorer-csr.git
cd space-explorer-csr
pnpm install

# Create your local environment file (gitignored) from the template, then add your key
cp src/environments/environment.example.ts src/environments/environment.ts

pnpm start   # → http://localhost:4200
```

## ⚠️ About the API key (CSR)

This app renders in the browser, so it calls NASA directly and the key is read on the client —
which means **a deployed build embeds the key in the JavaScript bundle** (extractable by visitors).
`environment.ts` is gitignored so the key is never in the repo, but it is not secret at runtime.

That is acceptable for a free, rate-limited NASA key / demo. If you need the key kept server-side,
use the SSR variant: **[space-explorer](https://github.com/omairab2/space-explorer)**.
