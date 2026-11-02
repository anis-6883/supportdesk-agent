import type { Ticket } from "./types.js";

type SeedTicket = Pick<Ticket, "id" | "userId" | "orderId" | "subject" | "message">;

const seed: SeedTicket[] = [
  {
    id: "TCK-001",
    userId: "USR-101",
    orderId: "ORD-9012",
    subject: "Package not arrived",
    message: "Where is my package #ORD9012? It was supposed to arrive yesterday."
  },
  {
    id: "TCK-002",
    userId: "USR-204",
    orderId: null,
    subject: "Upgrade request",
    message: "Can you upgrade my account to Enterprise tier?"
  },
  {
    id: "TCK-003",
    userId: "USR-309",
    orderId: null,
    subject: "Profile picture",
    message: "How do I update my profile picture?"
  }
];

export const tickets = new Map<string, Ticket>(
  seed.map((t): [string, Ticket] => [t.id, { ...t, status: "Pending", result: null, createdAt: new Date().toISOString() }])
);
