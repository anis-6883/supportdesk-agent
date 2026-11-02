import { Ticket, TriageResult, TraceStep } from '../types/ticket';

/**
 * Mock Triage Agent Service
 * 
 * Generates structured TriageResult with customerResponse, resolutionTag, reasoning,
 * trace steps (tool_call | final), and execution durations.
 */
export async function executeTriageAgent(
  ticket: Ticket,
  onProgress?: (phase: string) => void
): Promise<TriageResult> {
  // Phase 1: Analyzing ticket...
  onProgress?.('Analyzing ticket...');
  await new Promise((resolve) => setTimeout(resolve, 450));

  // Phase 2: Evaluating required actions...
  onProgress?.('Evaluating required actions...');
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Phase 3: Executing tools...
  onProgress?.('Executing tools...');
  await new Promise((resolve) => setTimeout(resolve, 550));

  // Phase 4: Generating customer response...
  onProgress?.('Generating customer response...');
  await new Promise((resolve) => setTimeout(resolve, 450));

  return generateTicketResult(ticket);
}

function generateTicketResult(ticket: Ticket): TriageResult {
  const now = new Date().toISOString();

  // Ticket 1: TCK-001 (order lookup)
  if (
    ticket.id === 'TCK-001' || 
    ticket.orderId || 
    ticket.message.toLowerCase().includes('package') || 
    ticket.message.toLowerCase().includes('order')
  ) {
    const orderId = ticket.orderId || 'ORD-9012';
    const trace: TraceStep[] = [
      {
        step: 1,
        at: now,
        type: 'tool_call',
        tool: 'get_order_status',
        params: { order_id: orderId },
        rawOutput: {
          order_id: orderId,
          status: 'In Transit',
          est_delivery: 'Tomorrow',
        },
        error: null,
        reasoning: 'Customer inquired about delayed package #ORD-9012. Identified order tracking intent and invoked get_order_status tool to fetch real-time carrier status.',
        durationMs: 310,
      },
      {
        step: 2,
        at: new Date(Date.now() + 320).toISOString(),
        type: 'final',
        error: null,
        reasoning: 'Carrier confirmed package ORD-9012 is In Transit with estimated delivery Tomorrow. Generated empathetic response informing customer of transit status. Auto-resolving ticket.',
        durationMs: 840,
      },
    ];

    return {
      customerResponse: "We're sorry your package didn't arrive as expected. Your order is currently in transit and is estimated to arrive tomorrow. Thank you for your patience!",
      resolutionTag: 'Auto-Resolve',
      reasoning: 'Logistics tool confirmed order ORD-9012 is actively in transit and scheduled for delivery tomorrow. Automated response provided with full tracking details.',
      trace,
      totalMs: 1150,
    };
  }

  // Ticket 2: TCK-002 (account upgrade)
  if (
    ticket.id === 'TCK-002' || 
    ticket.message.toLowerCase().includes('enterprise') || 
    ticket.message.toLowerCase().includes('upgrade')
  ) {
    const trace: TraceStep[] = [
      {
        step: 1,
        at: now,
        type: 'tool_call',
        tool: 'get_user_tier',
        params: { user_id: ticket.userId },
        rawOutput: {
          user_id: ticket.userId,
          current_tier: 'Free',
          eligible_for_upgrade: true,
        },
        error: null,
        reasoning: 'Customer inquired about Enterprise tier upgrade. Called get_user_tier to verify current account status and tier eligibility.',
        durationMs: 280,
      },
      {
        step: 2,
        at: new Date(Date.now() + 290).toISOString(),
        type: 'final',
        error: null,
        reasoning: 'User is on Free tier and eligible for Enterprise upgrade. Enterprise plans require custom billing negotiation and sales engagement. Escalating to sales desk.',
        durationMs: 760,
      },
    ];

    return {
      customerResponse: 'Thank you for your interest in our Enterprise plan! Your account is currently on the Free tier and is eligible for an upgrade. Our Sales team can help you with Enterprise plan options and next steps.',
      resolutionTag: 'Escalate to Sales',
      reasoning: 'Verified user USR-204 is on Free tier and qualifies for Enterprise upgrade. High-value expansion opportunity flagged for direct Sales follow-up.',
      trace,
      totalMs: 1040,
    };
  }

  // Ticket 3: TCK-003 or informational inquiry (no tool call required)
  const isProfilePicture = 
    ticket.message.toLowerCase().includes('picture') || 
    ticket.message.toLowerCase().includes('avatar');

  const customerResponse = isProfilePicture
    ? 'You can update your profile picture by opening your account settings, navigating to your profile, and selecting the option to change your picture. Upload your preferred image and save your changes.'
    : 'Thank you for reaching out! You can easily update this through your Account Settings menu. Please reply if you need any additional walkthrough.';

  const trace: TraceStep[] = [
    {
      step: 1,
      at: now,
      type: 'final',
      error: null,
      reasoning: 'Customer requested procedural walkthrough for UI feature. No external backend tool call or state modification required. Answered directly from knowledge base.',
      durationMs: 650,
    },
  ];

  return {
    customerResponse,
    resolutionTag: 'Auto-Resolve',
    reasoning: 'Self-serve informational inquiry resolved via standard knowledge base instructions without external system dependencies.',
    trace,
    totalMs: 650,
  };
}
