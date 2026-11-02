import React, { useState } from 'react';
import { TraceStep } from '../../types/ticket';
import { TraceStepItem } from './trace-step';
import { copyToClipboard } from '../../lib/utils';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Activity, 
  Clock, 
  Layers
} from 'lucide-react';

interface ExecutionTraceProps {
  trace: TraceStep[];
  totalMs?: number;
  ticketId: string;
  defaultExpanded?: boolean;
}

export const ExecutionTrace: React.FC<ExecutionTraceProps> = ({
  trace,
  totalMs,
  ticketId,
  defaultExpanded = false,
}) => {
  const [isSectionOpen, setIsSectionOpen] = useState<boolean>(defaultExpanded);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyTrace = async () => {
    const traceJson = JSON.stringify(
      {
        ticket_id: ticketId,
        total_ms: totalMs,
        steps: trace,
      },
      null,
      2
    );

    const success = await copyToClipboard(traceJson);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
      {/* Header / Collapsible Trigger */}
      <div className="p-4 flex items-center justify-between gap-3 bg-slate-50/70 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="flex items-center gap-2.5 text-left text-slate-900 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded cursor-pointer"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900">
                Agent Execution Trace
              </h3>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 tabular-nums">
                {trace.length} {trace.length === 1 ? 'step' : 'steps'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tool parameters, returned payloads, and decision reasoning
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {totalMs !== undefined && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 tabular-nums">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{totalMs}ms</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyTrace}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            title="Copy trace JSON to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Trace</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSectionOpen(!isSectionOpen)}
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors rounded hover:bg-slate-200/50 cursor-pointer"
            aria-label={isSectionOpen ? 'Collapse execution trace' : 'Expand execution trace'}
          >
            {isSectionOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Trace Body */}
      {isSectionOpen && (
        <div className="p-4 sm:p-5 bg-white">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Trace Timeline Log
            </span>
            <span>Observable tool events & returns</span>
          </div>

          <div className="space-y-0">
            {trace.map((step, idx) => (
              <TraceStepItem
                key={`${ticketId}-step-${step.step}-${idx}`}
                step={step}
                isLast={idx === trace.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
