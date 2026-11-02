import React, { useMemo } from 'react';
import { Ticket, TicketStatus } from '../../types/ticket';
import { TicketCard } from './ticket-card';
import { Search, X, Filter, RotateCcw, Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'All' | TicketStatus;
  onStatusFilterChange: (status: 'All' | TicketStatus) => void;
  onResetSeedData: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onResetSeedData,
}) => {
  // Filter tickets based on search and status
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusFilter !== 'All' && ticket.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = ticket.id.toLowerCase().includes(query);
        const matchesUser = ticket.userId.toLowerCase().includes(query);
        const matchesSubject = ticket.subject?.toLowerCase().includes(query);
        const matchesMessage = ticket.message.toLowerCase().includes(query);
        const matchesOrder = ticket.orderId?.toLowerCase().includes(query);
        return matchesId || matchesUser || matchesSubject || matchesMessage || Boolean(matchesOrder);
      }

      return true;
    });
  }, [tickets, statusFilter, searchQuery]);

  const filterTabs: Array<'All' | TicketStatus> = ['All', 'Pending', 'Processing', 'Resolved'];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Support Tickets
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold tabular-nums">
              {filteredTickets.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onResetSeedData}
            title="Reset to initial 3 seed tickets"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-md hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset Seed</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ticket ID, customer, order, or text..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg">
          {filterTabs.map((tab) => {
            const count = tab === 'All' 
              ? tickets.length 
              : tickets.filter((t) => t.status === tab).length;
            const isActive = statusFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => onStatusFilterChange(tab)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium rounded-md transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <span>{tab}</span>
                <span className={cn(
                  'text-[10px] tabular-nums',
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                )}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticket List Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedTicket?.id === ticket.id}
              onSelect={onSelectTicket}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-slate-700">No tickets match criteria</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Try adjusting your search query or status filter.
            </p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onStatusFilterChange('All');
              }}
              className="mt-3 text-xs text-indigo-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
