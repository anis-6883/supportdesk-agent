import { useEffect, useState } from "react";
import { Container } from "./components/layout/Container";
import { Header } from "./components/layout/Header";
import { SideBar } from "./components/layout/SideBar";
import { fetchAllTickets, fetchTicketById, resetLocalSeedStore, triageTicketViaApi } from "./lib/api";
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

  // Reset entire state back to initial 3 seed tickets
  const handleResetSeedData = () => {
    const seed = resetLocalSeedStore();
    setTickets(seed);
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
          onResetSeedData={handleResetSeedData}
        />
      </div>
    </div>
  );
}
