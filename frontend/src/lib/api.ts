import axios, { AxiosInstance } from 'axios';
import { Ticket, TriageResult } from '../types/ticket';
import { INITIAL_SEEDED_TICKETS } from './mock-tickets';
import { executeTriageAgent } from './mock-triage-agent';

// Backend API URL as requested: http://localhost:5000
export const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// In-memory fallback cache if backend at localhost:5000 is not reachable
let localTickets: Ticket[] = JSON.parse(JSON.stringify(INITIAL_SEEDED_TICKETS));

export const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T> {
  data: T;
  isBackendConnected: boolean;
  error?: string;
}

/**
 * Fetch all tickets from backend: /api/tickets
 */
export async function fetchAllTickets(): Promise<ApiResponse<Ticket[]>> {
  try {
    const response = await apiClient.get<Ticket[]>('/api/tickets');
    if (Array.isArray(response.data)) {
      // Sync local cache with backend data
      localTickets = response.data;
      return { data: response.data, isBackendConnected: true };
    }
    return { data: localTickets, isBackendConnected: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Backend unreachable';
    console.warn(`[Axios] GET ${BACKEND_URL}/api/tickets failed (${errorMessage}). Using local fallback store.`, err);
    return {
      data: localTickets,
      isBackendConnected: false,
      error: `Could not reach ${BACKEND_URL}/api/tickets. Using local data store.`,
    };
  }
}

/**
 * Fetch a single ticket by ID: api/tickets/{id}
 */
export async function fetchTicketById(id: string): Promise<ApiResponse<Ticket | null>> {
  try {
    const response = await apiClient.get<Ticket>(`/api/tickets/${id}`);
    if (response.data) {
      // Update local cache
      const idx = localTickets.findIndex((t) => t.id === id);
      if (idx !== -1) {
        localTickets[idx] = response.data;
      } else {
        localTickets.push(response.data);
      }
      return { data: response.data, isBackendConnected: true };
    }
    const found = localTickets.find((t) => t.id === id) || null;
    return { data: found, isBackendConnected: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Backend unreachable';
    console.warn(`[Axios] GET ${BACKEND_URL}/api/tickets/${id} failed (${errorMessage}). Using local fallback store.`, err);
    const found = localTickets.find((t) => t.id === id) || null;
    return {
      data: found,
      isBackendConnected: false,
      error: `Could not reach ${BACKEND_URL}/api/tickets/${id}`,
    };
  }
}

/**
 * Run triage on a ticket via backend API if available, or simulated service
 */
export async function triageTicketViaApi(
  ticket: Ticket,
  onProgress?: (phase: string) => void
): Promise<TriageResult> {
  try {
    // Attempt backend triage endpoint: POST /api/tickets/{id}/triage or POST /api/triage
    onProgress?.('Sending triage request to backend...');
    const response = await apiClient.post<TriageResult>(`/api/tickets/${ticket.id}/triage`, {
      ticket,
    });
    if (response.data && response.data.customerResponse) {
      return response.data;
    }
  } catch {
    // Fall back to local mock agent if backend endpoint doesn't exist
  }

  // Fall back to client simulation
  return await executeTriageAgent(ticket, onProgress);
}

/**
 * Update a ticket in the local store
 */
export function updateLocalTicket(ticket: Ticket): void {
  const index = localTickets.findIndex((t) => t.id === ticket.id);
  if (index !== -1) {
    localTickets[index] = ticket;
  } else {
    localTickets.unshift(ticket);
  }
}

/**
 * Reset local seed tickets
 */
export function resetLocalSeedStore(): Ticket[] {
  localTickets = JSON.parse(JSON.stringify(INITIAL_SEEDED_TICKETS));
  return localTickets;
}
