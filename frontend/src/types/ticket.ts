export type TicketStatus = "Pending" | "Processing" | "Resolved";
export type ResolutionTag = "Auto-Resolve" | "Escalate to Sales";

export interface TraceStep {
  step: number;
  at: string;
  type: "tool_call" | "final";
  tool?: string;
  params?: unknown;
  rawOutput?: unknown;
  error?: string | null;
  reasoning?: string;
  durationMs?: number;
}

export interface TriageResult {
  customerResponse: string;
  resolutionTag: ResolutionTag;
  reasoning: string;
  trace: TraceStep[];
  totalMs: number;
}

export interface Ticket {
  id: string;
  userId: string;
  orderId: string | null;
  subject: string;
  message: string;
  status: TicketStatus;
  result: TriageResult | null;
  createdAt: string;
}

export type ToolArgs = Record<string, unknown>;

export interface OrderStatus {
  order_id: string;
  status: string;
  est_delivery: string;
}

export interface UserTier {
  user_id: string;
  current_tier: string;
  eligible_for_upgrade: boolean;
}

export interface TicketFilterOptions {
  searchQuery: string;
  statusFilter: 'All' | TicketStatus;
}
