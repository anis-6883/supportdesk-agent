import { Type, type FunctionDeclaration } from "@google/genai";
import type { OrderStatus, ToolArgs, UserTier } from "./types.js";

function requireString(args: ToolArgs, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required and must be a non-empty string`);
  }
  return value;
}

// ---- Mock implementations (return exactly what the spec says) ----
export const toolImpl: Record<string, (args: ToolArgs) => OrderStatus | UserTier> = {
  get_order_status(args) {
    const order_id = requireString(args, "order_id");
    return { order_id, status: "In Transit", est_delivery: "Tomorrow" };
  },
  get_user_tier(args) {
    const user_id = requireString(args, "user_id");
    return { user_id, current_tier: "Free", eligible_for_upgrade: true };
  }
};

// ---- Schemas the LLM sees ----
export const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "get_order_status",
    description: "Look up shipping status and ETA for an order. Use when the customer asks about a package/order.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        order_id: { type: Type.STRING, description: "Order ID, e.g. ORD-9012" }
      },
      required: ["order_id"]
    }
  },
  {
    name: "get_user_tier",
    description: "Look up a customer's current plan tier and upgrade eligibility. Use for plan/upgrade/billing-tier questions.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        user_id: { type: Type.STRING, description: "User ID, e.g. USR-204" }
      },
      required: ["user_id"]
    }
  },
  {
    // "Finalizer" tool: forces structured output at the end of the loop
    name: "submit_resolution",
    description: "Call this LAST, exactly once, to submit the final customer reply and resolution tag.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        customer_response: {
          type: Type.STRING,
          description: "Friendly, ready-to-send draft reply to the customer"
        },
        resolution_tag: {
          type: Type.STRING,
          enum: ["Auto-Resolve", "Escalate to Sales"]
        },
        reasoning: {
          type: Type.STRING,
          description: "1-2 sentences on why this tag was chosen"
        }
      },
      required: ["customer_response", "resolution_tag", "reasoning"]
    }
  }
];
