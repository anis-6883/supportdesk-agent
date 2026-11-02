export type { 
  TicketStatus, 
  ResolutionTag, 
  TraceStep, 
  TriageResult, 
  Ticket, 
  ToolArgs, 
  OrderStatus, 
  UserTier 
} from './ticket';

export type TriageProgressPhase = 
  | 'idle'
  | 'analyzing'
  | 'evaluating'
  | 'executing_tools'
  | 'generating_response'
  | 'completed';
