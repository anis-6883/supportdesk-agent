import React from 'react';
import { Ticket } from '../../types/ticket';
import { TicketStatusBadge, ResolutionBadge } from './ticket-status-badge';
import { cn } from '../../lib/utils';
import { Sparkles, Package, User } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(ticket)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(ticket);
        }
      }}
      className={cn(
        'w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative',
        isSelected
          ? 'bg-indigo-50/40 border-indigo-400 ring-1 ring-indigo-400/30 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
      )}
    >
      {/* Top row: ID, User ID & Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">
            {ticket.id}
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
            <User className="w-3 h-3 text-slate-400" />
            {ticket.userId}
          </span>
        </div>

        <TicketStatusBadge status={ticket.status} size="sm" />
      </div>

      {/* Subject */}
      {ticket.subject && (
        <h4 className="text-xs font-semibold text-slate-900 truncate mb-1">
          {ticket.subject}
        </h4>
      )}

      {/* Message preview */}
      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal mb-2.5">
        {ticket.message}
      </p>

      {/* Bottom meta row: Order ID tag, Resolution Tag, or Processed state */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
        <div className="flex items-center gap-2 text-slate-500">
          {ticket.orderId ? (
            <span className="inline-flex items-center gap-1 font-mono text-slate-600">
              <Package className="w-3 h-3 text-slate-400" />
              {ticket.orderId}
            </span>
          ) : (
            <span className="text-slate-400">Direct inquiry</span>
          )}
        </div>

        {ticket.result ? (
          <div className="flex items-center gap-1">
            <ResolutionBadge tag={ticket.result.resolutionTag} size="sm" />
          </div>
        ) : ticket.status === 'Processing' ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium">
            <Sparkles className="w-3 h-3 animate-spin" />
            Triaging...
          </span>
        ) : (
          <span className="text-slate-400 text-[11px]">Pending AI triage</span>
        )}
      </div>
    </div>
  );
};
