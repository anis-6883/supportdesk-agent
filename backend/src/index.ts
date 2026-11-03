import cors from "cors";
import "dotenv/config";
import express, { type ErrorRequestHandler, type Request, type Response } from "express";
import { runTriageAgent } from "./agent.js";
import { tickets } from "./data.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/api/tickets", (_req: Request, res: Response) => {
  res.json([...tickets.values()]);
});

app.get("/api/tickets/:id", (req: Request<{ id: string }>, res: Response) => {
  const ticket = tickets.get(req.params.id);
  if (!ticket) return void res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
});

app.post("/api/tickets/:id/triage", async (req: Request<{ id: string }>, res: Response) => {
  const ticket = tickets.get(req.params.id);
  if (!ticket) return void res.status(404).json({ error: "Ticket not found" });

  try {
    const result = await runTriageAgent(ticket);
    ticket.status = "Resolved";
    ticket.result = result;
    res.json(ticket);
  } catch (err) {
    console.error("[triage error]", err);
    ticket.status = "Pending";
    const message = err instanceof Error ? err.message : "Agent failed";
    res.status(502).json({ error: message });
  }
});

// Final Error Handler
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ error: message });
};
app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
