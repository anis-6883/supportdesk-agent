import React from 'react';
import { Ticket, TicketStatus } from '../../types/ticket';
import { DashboardStats } from '../dashboard/dashboard-stats';
import { TicketList } from '../dashboard/ticket-list';
import { TicketDetails } from '../dashboard/ticket-details';
import { RotateCcw } from 'lucide-react';

interface ContainerProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  isLoadingSingleTicket: boolean;
  isProcessing: boolean;
  processingTicketId: string | null;
  progressPhase: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'All' | TicketStatus;
  onStatusFilterChange: (status: 'All' | TicketStatus) => void;
  onSelectTicket: (ticket: Ticket) => void;
  onDeselectTicket: () => void;
  onRunTriage: (ticket: Ticket) => void;
  onResetTicketTriage: (ticketId: string) => void;
  onResetSeedData: () => void;
}

export const Container: React.FC<ContainerProps> = ({
  tickets,
  selectedTicket,
  isLoadingSingleTicket,
  isProcessing,
  processingTicketId,
  progressPhase,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onSelectTicket,
  onDeselectTicket,
  onRunTriage,
  onResetTicketTriage,
  onResetSeedData,
}) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      {/* Top Quick Actions & Summary Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <DashboardStats tickets={tickets} />

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onResetSeedData}
            title="Reset all 3 tickets to initial Pending status"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 hover:bg-indigo-100 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Two-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Ticket List (~35%) */}
        <div className="lg:col-span-5 xl:col-span-4 h-[calc(100vh-210px)] min-h-[500px]">
          <TicketList
            tickets={tickets}
            selectedTicket={selectedTicket}
            onSelectTicket={onSelectTicket}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
            onResetSeedData={onResetSeedData}
          />
        </div>

        {/* Right Column: Ticket Details & AI Triage Results (~65%) */}
        <div className="lg:col-span-7 xl:col-span-8 overflow-y-auto">
          {/* Requirement 5: When we click a ticket from list, then show the details otherwise show a message with border */}
          <TicketDetails
            ticket={selectedTicket}
            isLoadingTicket={isLoadingSingleTicket}
            isProcessing={isProcessing && processingTicketId === selectedTicket?.id}
            progressPhase={progressPhase}
            onRunTriage={onRunTriage}
            onResetTicketTriage={onResetTicketTriage}
            onDeselectTicket={onDeselectTicket}
          />
        </div>
      </div>
    </main>
  );
};
