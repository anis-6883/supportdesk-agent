import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Container } from "./components/layout/Container";
import { Header } from "./components/layout/Header";
import { SideBar } from "./components/layout/SideBar";
import { fetchAllTickets, fetchTicketById, triageTicketViaApi } from "./lib/api";
import { Ticket, TicketStatus } from "./types/ticket";

export default function App() {
  // Ticket list state
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Selected Ticket state (null initially: show message with border)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoadingSingleTicket, setIsLoadingSingleTicket] = useState<boolean>(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"All" | TicketStatus>("All");

  // Agent Execution State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPhase, setProgressPhase] = useState<string>("");
  const [processingTicketId, setProcessingTicketId] = useState<string | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile Sidebar Drawer
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // 1. Initial load of all tickets via Axios: GET /api/tickets
  const loadAllTickets = async () => {
    try {
      const res = await fetchAllTickets();
      setTickets(res.data);
    } catch (err: unknown) {
      console.error("Failed to load tickets:", err);
    }
  };

  useEffect(() => {
    loadAllTickets();
  }, []);

  // 2. Click ticket from list: fetch details via Axios GET api/tickets/{id}
  const handleSelectTicket = async (ticket: Ticket) => {
    setIsLoadingSingleTicket(true);
    try {
      const res = await fetchTicketById(ticket.id);
      setSelectedTicket(res.data || ticket);
    } catch {
      setSelectedTicket(ticket);
    } finally {
      setIsLoadingSingleTicket(false);
    }
  };

  // Deselect ticket to show bordered placeholder
  const handleDeselectTicket = () => {
    setSelectedTicket(null);
  };

  // 3. Handle running AI triage agent
  const handleRunTriage = async (ticket: Ticket) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setProcessingTicketId(ticket.id);

    const updatedProcessingTicket: Ticket = {
      ...ticket,
      status: "Processing",
      result: null
    };

    setTickets(prev => prev.map(t => (t.id === ticket.id ? updatedProcessingTicket : t)));
    setSelectedTicket(updatedProcessingTicket);

    try {
      const result = await triageTicketViaApi(ticket, phase => {
        setProgressPhase(phase);
      });

      const updatedResolvedTicket: Ticket = {
        ...ticket,
        status: "Resolved",
        result
      };

      setTickets(prev => prev.map(t => (t.id === ticket.id ? updatedResolvedTicket : t)));
      setSelectedTicket(updatedResolvedTicket);
    } catch (error) {
      console.error("Triage agent execution failed:", error);

      // Revert ticket to Pending status upon server failure
      const revertedPendingTicket: Ticket = {
        ...ticket,
        status: "Pending",
        result: null
      };

      setTickets(prev => prev.map(t => (t.id === ticket.id ? revertedPendingTicket : t)));
      setSelectedTicket(revertedPendingTicket);

      // Trigger toast message
      setToastMessage("Something went wrong on the server while triaging the ticket. The ticket has been returned to Pending.");
      setTimeout(() => {
        setToastMessage(prev => (prev?.includes("went wrong on the server") ? null : prev));
      }, 5000);
    } finally {
      setIsProcessing(false);
      setProcessingTicketId(null);
      setProgressPhase("");
    }
  };

  // Reset triage for a single ticket
  const handleResetTicketTriage = (ticketId: string) => {
    const resetTicket = (t: Ticket): Ticket => ({
      ...t,
      status: "Pending",
      result: null
    });

    setTickets(prev => prev.map(t => (t.id === ticketId ? resetTicket(t) : t)));

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => (prev ? resetTicket(prev) : null));
    }
  };

  // Reload tickets from backend
  const handleReloadTickets = () => {
    loadAllTickets();
    setSelectedTicket(null);
    setSearchQuery("");
    setStatusFilter("All");
  };

  const pendingCount = tickets.filter(t => t.status === "Pending" || t.status === "Processing").length;

  return (
    <div className='flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden'>
      {/* Left Navigation Sidebar */}
      <SideBar isOpenOnMobile={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} pendingCount={pendingCount} />

      {/* Main Layout Area */}
      <div className='flex flex-col flex-1 h-screen min-w-0 overflow-hidden'>
        {/* Header Component */}
        <Header isAgentProcessing={isProcessing} onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} pendingCount={pendingCount} />

        {/* Main Content Container Component */}
        <Container
          tickets={tickets}
          selectedTicket={selectedTicket}
          isLoadingSingleTicket={isLoadingSingleTicket}
          isProcessing={isProcessing}
          processingTicketId={processingTicketId}
          progressPhase={progressPhase}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSelectTicket={handleSelectTicket}
          onDeselectTicket={handleDeselectTicket}
          onRunTriage={handleRunTriage}
          onResetTicketTriage={handleResetTicketTriage}
          onResetSeedData={handleReloadTickets}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-rose-600 text-white text-xs font-medium rounded-lg shadow-xl border border-rose-700 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-white" />
          <p className="flex-1 leading-snug">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-rose-700/60 rounded transition-colors text-white/80 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
