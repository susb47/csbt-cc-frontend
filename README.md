# CausalBioTwin Frontend

Vue 3 + Tailwind CSS + Pinia frontend for the AI Healthcare Digital Twin Platform.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## Backend API

Connected to: `https://sumoy47-infinity-ai-bf.hf.space`

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing/hero page |
| Login | `/login` | Auth with role selection |
| Dashboard | `/dashboard` | Overview & stats |
| Simulator | `/simulator` | Digital twin + drug simulation + XAI |
| Federated | `/federated` | Hospital network sync visualization |
| Governance | `/governance` | Protocol voting & audit log |
| Reports | `/reports` | Simulation history & feature importance |

## Features

- **Interactive Anatomy SVG** — clickable organs with health-based coloring
- **Drug Simulation** — calls `/simulate` endpoint with real-time trajectory charts
- **XAI Explanations** — causal reasoning, risk factors, SHAP-style summaries
- **Live Vitals** — animated vital tiles with normal/warning/critical states
- **Federated Learning Viz** — Chart.js accuracy/loss curves + hospital node cards
- **Governance Voting** — approve/reject proposals with audit trail
- **Glassmorphism UI** — dark theme with backdrop blur and glow effects

## Tech Stack

- Vue 3 (Composition API)
- Vue Router
- Pinia (state management)
- Tailwind CSS
- Chart.js + vue-chartjs
- Axios
- Lucide Vue Next (icons)
