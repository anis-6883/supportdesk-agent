import React from 'react';
import { Ticket } from '../../types/ticket';
import { TicketStatusBadge } from './ticket-status-badge';
import { AgentResultCard } from './agent-result-card';
import { formatTimestamp } from '../../lib/utils';
import { 
  Bot, 
  Sparkles, 
  Loader2, 
  RotateCw, 
  User, 
  Calendar, 
  Package, 
  MessageSquare, 
  Inbox, 
  X,
  MousePointerClick,
  FileQuestion
} from 'lucide-react';

interface TicketDetailsProps {
  ticket: Ticket | null;
  isLoadingTicket?: boolean;
  isProcessing: boolean;
  progressPhase: string;
  onRunTriage: (ticket: Ticket) => void;
  onResetTicketTriage: (ticketId: string) => void;
  onDeselectTicket?: () => void;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({
  ticket,
  isLoadingTicket = false,
  isProcessing,
  progressPhase,
  onRunTriage,
  onResetTicketTriage,
  onDeselectTicket,
}) => {
  // Requirement 5: "When we click a ticket from list, then show the details otherwise show a message with border"
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[460px] p-8 text-center bg-white rounded-xl border-2 border-dashed border-slate-300 shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-2xs">
          <MousePointerClick className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          No Ticket Selected
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
          Select a ticket from the list on the left to inspect customer details, query backend APIs, and execute autonomous AI triage.
        </p>
        <div className="mt-4 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono">
          Click any card under "Support Tickets" to load details
        </div>
      </div>
    );
  }

  if (isLoadingTicket) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[460px] p-8 text-center bg-white rounded-xl border border-slate-200 shadow-2xs">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <h3 className="text-sm font-bold text-slate-900">
          Loading Ticket Details...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Fetching from /api/tickets/{ticket.id}
        </p>
      </div>
    );
  }

  const hasResult = Boolean(ticket.result);

  return (
    <div className="space-y-4 pb-6">
      {/* Ticket Information Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        {/* Top bar: ID, metadata, status badge, deselect button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold tracking-tight shadow-2xs">
              {ticket.id.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {ticket.id}
                </h2>
                <TicketStatusBadge status={ticket.status} size="sm" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  User: {ticket.userId}
                </span>
                {ticket.subject && (
                  <>
                    <span>·</span>
                    <span className="text-slate-600 font-medium truncate max-w-xs">
                      {ticket.subject}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onDeselectTicket && (
              <button
                type="button"
                onClick={onDeselectTicket}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                title="Deselect ticket (close details)"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {hasResult && !isProcessing && (
              <button
                type="button"
                onClick={() => onResetTicketTriage(ticket.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors shadow-2xs cursor-pointer"
                title="Reset triage result and run again"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Re-triage</span>
              </button>
            )}

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onRunTriage(ticket)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 rounded-lg shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Agent Processing...</span>
                </>
              ) : hasResult ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Re-run AI Triage</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Triage Agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Processing Progress Banner */}
        {isProcessing && (
          <div className="mt-4 p-3.5 rounded-lg bg-blue-50/70 border border-blue-200/80 animate-pulse">
            <div className="flex items-center justify-between text-xs text-blue-900 font-medium">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                {progressPhase || 'Agent analyzing ticket requirements...'}
              </span>
              <span className="font-mono text-[11px] text-blue-600">Simulating Agent Flow</span>
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-indigo-600 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-1">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span>Order ID</span>
            </div>
            <div className="font-mono text-xs font-semibold text-slate-800">
              {ticket.orderId ? (
                <span className="text-indigo-700">{ticket.orderId}</span>
              ) : (
                <span className="text-slate-400 font-normal">None attached</span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Created At</span>
            </div>
            <div className="text-xs font-semibold text-slate-800 tabular-nums">
              {formatTimestamp(ticket.createdAt)}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>User ID</span>
            </div>
            <div className="text-xs font-mono font-semibold text-slate-800 truncate" title={ticket.userId}>
              {ticket.userId}
            </div>
          </div>
        </div>

        {/* Customer Message Section */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Customer Message</span>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-800 text-sm leading-relaxed">
            "{ticket.message}"
          </div>
        </div>
      </div>

      {/* AI Triage Result and Execution Trace */}
      {ticket.result && (
        <AgentResultCard
          result={ticket.result}
          ticketId={ticket.id}
          onSendReply={(reply) => {
            console.log('Approved reply for ticket:', ticket.id, reply);
          }}
        />
      )}

      {/* Prompt when not triaged yet */}
      {!ticket.result && !isProcessing && (
        <div className="p-6 rounded-xl border border-dashed border-slate-300 bg-white text-center">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">
            Ticket Ready for AI Triage
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Click <strong className="text-slate-700">"Run AI Triage Agent"</strong> to analyze customer intent, execute required backend tool lookups, generate a response draft, and inspect the real-time execution trace.
          </p>
        </div>
      )}
    </div>
  );
};
