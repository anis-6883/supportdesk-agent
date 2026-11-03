import axios, { AxiosInstance } from "axios";
import { Ticket, TriageResult } from "../types/ticket";

// Backend API URL: defaults to http://localhost:5000
export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json"
  }
});

export interface ApiResponse<T> {
  data: T;
  isBackendConnected: boolean;
  error?: string;
}

/**
 * Fetch all tickets from backend: GET /api/tickets
 */
export async function fetchAllTickets(): Promise<ApiResponse<Ticket[]>> {
  try {
    const response = await apiClient.get<Ticket[]>("/api/tickets");
    if (Array.isArray(response.data)) {
      return { data: response.data, isBackendConnected: true };
    }
    return { data: [], isBackendConnected: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Backend unreachable";
    console.warn(`[Axios] GET ${BACKEND_URL}/api/tickets failed (${errorMessage}).`, err);
    return {
      data: [],
      isBackendConnected: false,
      error: `Could not reach ${BACKEND_URL}/api/tickets: ${errorMessage}`
    };
  }
}

/**
 * Fetch a single ticket by ID: GET /api/tickets/{id}
 */
export async function fetchTicketById(id: string): Promise<ApiResponse<Ticket | null>> {
  try {
    const response = await apiClient.get<Ticket>(`/api/tickets/${id}`);
    return { data: response.data ?? null, isBackendConnected: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Backend unreachable";
    console.warn(`[Axios] GET ${BACKEND_URL}/api/tickets/${id} failed (${errorMessage}).`, err);
    return {
      data: null,
      isBackendConnected: false,
      error: `Could not reach ${BACKEND_URL}/api/tickets/${id}: ${errorMessage}`
    };
  }
}

/**
 * Run triage on a ticket via backend API: POST /api/tickets/{id}/triage
 */
export async function triageTicketViaApi(ticket: Ticket, onProgress?: (phase: string) => void): Promise<TriageResult> {
  onProgress?.("Sending triage request to backend...");
  const response = await apiClient.post<Ticket | TriageResult>(
    `/api/tickets/${ticket.id}/triage`,
    { ticket },
    { timeout: 120000 }
  );

  const data = response.data;
  // If backend returned the full Ticket object with result:
  if (data && "result" in data && data.result?.customerResponse) {
    return data.result;
  }
  // If backend returned the TriageResult directly:
  if (data && "customerResponse" in data && data.customerResponse) {
    return data as TriageResult;
  }

  throw new Error("Invalid response received from triage server");
}
