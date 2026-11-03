# SupportDesk Agent - Frontend

Modern React dashboard for reviewing, inspecting, and triaging customer support tickets with an AI agent.

---

## Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Motion](https://motion.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Package Manager:** `pnpm`

---

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Ticket cards, list, details, traces, stats
│   │   └── layout/          # Header, Sidebar, Container layout wrappers
│   ├── lib/
│   │   ├── api.ts           # Axios backend API client & requests
│   │   └── utils.ts         # Utility helpers & class merger
│   ├── types/
│   │   ├── ticket.ts        # Ticket, Trace, and TriageResult type definitions
│   │   └── agent.ts         # Agent status interfaces
│   ├── App.tsx              # Main dashboard view state & logic
│   ├── main.tsx             # React entry root
│   └── index.css            # Tailwind theme styles
├── index.html               # Vite HTML entry
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Scripts & dependencies
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v9+)
- SupportDesk Agent Backend running (typically on `http://localhost:5000`)

---

## Setup & Installation

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
pnpm install
```

> **Note for Windows PowerShell:** If running scripts is restricted by PowerShell policy, run using `pnpm.cmd install` or start your terminal with an unrestricted execution policy.

---

## Environment Variables Configuration

Create a `.env` file in the `frontend` root directory:

```env
VITE_API_URL=http://localhost:5000
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API server | `http://localhost:5000` |

If omitted, the API client automatically defaults to `http://localhost:5000`.

---

## Available Scripts

From inside the `frontend` directory:

### Run Development Server

```bash
pnpm dev
```
Starts the Vite dev server at **`http://localhost:3000`** with Hot Module Replacement (HMR).

### Build for Production

```bash
pnpm build
```
Compiles TypeScript and bundles production-ready static assets into the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```
Spins up a local server to preview the built application from `dist/`.

### TypeScript Type-check

```bash
pnpm lint
```
Runs `tsc --noEmit` to validate all TypeScript types without generating output files.

---

## Features

- **Live Backend Integration:** Synchronizes ticket data directly via Express REST endpoints (`/api/tickets`, `/api/tickets/:id`).
- **Interactive AI Triage:** Triggers the backend Gemini triage agent (`/api/tickets/:id/triage`) with full execution traces.
- **Filtering & Search:** Real-time search across ticket IDs, customer IDs, and subjects, with status filters (`All`, `Pending`, `Processing`, `Resolved`).
- **Error Handling & Notifications:** Reverts ticket status and displays toast notifications if the server encounters issues during triage.

