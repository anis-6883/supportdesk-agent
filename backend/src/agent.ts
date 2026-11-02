import { GoogleGenAI, type Content, type Part } from "@google/genai";
import { functionDeclarations, toolImpl } from "./tools.js";
import type { ResolutionTag, Ticket, ToolArgs, TraceStep, TriageResult } from "./types.js";

const MAX_STEPS = 5;
const VALID_TAGS: readonly ResolutionTag[] = ["Auto-Resolve", "Escalate to Sales"];

const SYSTEM_PROMPT = `You are a customer-support triage agent.
Rules:
- Order/shipping questions -> call get_order_status using the order ID from ticket metadata.
- Plan/upgrade questions -> call get_user_tier using the user ID from ticket metadata.
- General how-to questions -> call NO lookup tool; answer directly.
- Requests to upgrade to Enterprise must be tagged "Escalate to Sales" and the draft should explain next steps.
- Everything that can be answered without a human is tagged "Auto-Resolve".
- Never invent order or account data; only use tool results.
- Always finish by calling submit_resolution exactly once.`;

function isValidTag(value: unknown): value is ResolutionTag {
  return typeof value === "string" && (VALID_TAGS as readonly string[]).includes(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export async function runTriageAgent(ticket: Ticket): Promise<TriageResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set on the server");

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const trace: TraceStep[] = [];
  const t0 = Date.now();

  const log = (entry: Omit<TraceStep, "step" | "at">): void => {
    trace.push({ step: trace.length + 1, at: new Date().toISOString(), ...entry });
  };

  const contents: Content[] = [
    {
      role: "user",
      parts: [
        {
          text: `Ticket ${ticket.id}\nUser ID: ${ticket.userId}\nOrder ID: ${ticket.orderId ?? "none"}\nMessage: "${ticket.message}"`
        }
      ]
    }
  ];

  for (let i = 0; i < MAX_STEPS; i++) {
    const res = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
        tools: [{ functionDeclarations }]
      }
    });

    const content = res.candidates?.[0]?.content;
    if (content) contents.push(content);

    const thought = (content?.parts ?? [])
      .filter((p): p is Part & { text: string } => typeof p.text === "string")
      .map(p => p.text)
      .join("")
      .trim();
    const calls = res.functionCalls ?? [];

    // Model replied with plain text and no tool call -> fallback
    if (calls.length === 0) {
      log({
        type: "final",
        reasoning: "Model answered without submit_resolution; using fallback."
      });
      return {
        customerResponse: thought || "Thanks for reaching out. A team member will follow up shortly.",
        resolutionTag: "Auto-Resolve",
        reasoning: "Fallback: model returned free text.",
        trace,
        totalMs: Date.now() - t0
      };
    }

    const responseParts: Part[] = [];

    for (const call of calls) {
      const name = call.name ?? "unknown";
      const args: ToolArgs = call.args ?? {};

      if (name === "submit_resolution") {
        const tag = isValidTag(args.resolution_tag) ? args.resolution_tag : "Auto-Resolve";
        const reasoning = asString(args.reasoning);
        log({ type: "final", tool: "submit_resolution", params: args, reasoning });
        return {
          customerResponse: asString(args.customer_response, "Thanks for reaching out. A team member will follow up shortly."),
          resolutionTag: tag,
          reasoning,
          trace,
          totalMs: Date.now() - t0
        };
      }

      // Execute mock tool safely
      const started = Date.now();
      let output: Record<string, unknown>;
      let error: string | null = null;
      try {
        const fn = toolImpl[name];
        if (!fn) throw new Error(`Unknown tool: ${name}`);
        output = { ...fn(args) };
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
        output = { error };
      }

      log({
        type: "tool_call",
        tool: name,
        params: args,
        rawOutput: output,
        error,
        reasoning: thought || "Model decided this tool was needed to answer the ticket.",
        durationMs: Date.now() - started
      });
      responseParts.push({ functionResponse: { name, response: output } });
    }

    contents.push({ role: "user", parts: responseParts });
  }

  throw new Error("Agent exceeded max steps without producing a resolution");
}
