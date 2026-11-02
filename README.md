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

*(On Windows PowerShell, use `copy .env.example .env`)*

Configure the following variables in `.env`:

```env
PORT="5000"
GEMINI_API_KEY="your_actual_gemini_api_key_here"
GEMINI_MODEL="gemini-2.5-flash"
FRONTEND_ORIGIN="http://localhost:3000"
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port number the backend server listens on | `5000` (or `4000`) |
| `GEMINI_API_KEY` | Google Gemini API key required for the triage agent | Required |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.5-flash` |
| `FRONTEND_ORIGIN` | Allowed origin for CORS requests | `http://localhost:3000` |

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

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning `{ ok: true }` |
| `GET` | `/api/tickets` | Returns the list of all tickets |
| `GET` | `/api/tickets/:id` | Returns details for a specific ticket |
| `POST` | `/api/tickets/:id/triage` | Triggers the AI triage agent for the ticket |

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

