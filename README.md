# SupportDesk Agent - Backend

AI-powered Support Desk triage backend built with Node.js, Express, TypeScript, and Google Gemini.

---

## Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Language:** TypeScript
- **Package Manager:** `pnpm`
- **AI / LLM:** Google Gen AI SDK (`@google/genai`)
- **Development Tooling:** `tsx`, `ts-node`

---

## Project Structure

```text
backend/
├── src/
│   ├── index.ts        # Express server entry point & API route definitions
│   ├── agent.ts        # Gemini-powered triage agent logic
│   ├── tools.ts        # Agent tool definitions (lookups, actions, etc.)
│   ├── types.ts        # TypeScript interfaces & types
│   └── data.ts         # In-memory ticket state and mock data
├── .env.example        # Environment variable template
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies & run scripts
└── pnpm-workspace.yaml # pnpm build approval configuration
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v9+)
- A [Google Gemini API Key](https://aistudio.google.com/)

---

## Setup & Installation

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
pnpm install
```

> **Note for Windows PowerShell:** If running scripts is restricted by PowerShell policy, either use `pnpm.cmd` or run PowerShell with an unrestricted execution policy.

---

## Environment Variables Configuration

Copy the sample environment file to create `.env`:

```bash
cp .env.example .env
```

_(On Windows PowerShell, use `copy .env.example .env`)_

Configure the following variables in `.env`:

```env
PORT="5000"
GEMINI_API_KEY="your_actual_gemini_api_key_here"
GEMINI_MODEL="gemini-2.5-flash"
FRONTEND_ORIGIN="http://localhost:3000"
```

| Variable          | Description                                         | Default                 |
| :---------------- | :-------------------------------------------------- | :---------------------- |
| `PORT`            | Port number the backend server listens on           | `5000` (or `4000`)      |
| `GEMINI_API_KEY`  | Google Gemini API key required for the triage agent | Required                |
| `GEMINI_MODEL`    | Gemini model name                                   | `gemini-2.5-flash`      |
| `FRONTEND_ORIGIN` | Allowed origin for CORS requests                    | `http://localhost:3000` |

---

## Available Scripts

From inside the `backend` folder:

### Development Mode (with hot reloading)

```bash
pnpm dev
```

Starts the server with `tsx watch` for auto-reloading on code changes.

### Build TypeScript

```bash
pnpm build
```

Compiles TypeScript files into the `dist/` directory.

### Production Run

```bash
pnpm start
```

Executes the compiled JavaScript code in `dist/index.js`.

---

## API Endpoints

| Method | Endpoint                  | Description                                    |
| :----- | :------------------------ | :--------------------------------------------- |
| `GET`  | `/api/health`             | Health check endpoint returning `{ ok: true }` |
| `GET`  | `/api/tickets`            | Returns the list of all tickets                |
| `GET`  | `/api/tickets/:id`        | Returns details for a specific ticket          |
| `POST` | `/api/tickets/:id/triage` | Triggers the AI triage agent for the ticket    |

### Example cURL Requests

**Health check:**

```bash
curl http://localhost:5000/api/health
```

**Get all tickets:**

```bash
curl http://localhost:5000/api/tickets
```

**Run Triage Agent on a ticket:**

```bash
curl -X POST http://localhost:5000/api/tickets/1/triage
```

---

---

---

---

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

| Variable       | Description                        | Default                 |
| :------------- | :--------------------------------- | :---------------------- |
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
