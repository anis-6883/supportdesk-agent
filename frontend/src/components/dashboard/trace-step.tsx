import { AlertCircle, ChevronDown, ChevronRight, Clock, Sparkles, Wrench } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { TraceStep as ITraceStep } from "../../types/ticket";

interface TraceStepProps {
  step: ITraceStep;
  isLast?: boolean;
}

export const TraceStepItem: React.FC<TraceStepProps> = ({ step, isLast = false }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const hasExtraData = Boolean(step.tool || step.reasoning || step.params || step.rawOutput || step.error);

  const isToolCall = step.type === "tool_call";

  return (
    <div className='relative flex gap-3 text-sm'>
      {/* Vertical timeline connector */}
      {!isLast && <div className='absolute left-3.25 top-6.5 bottom-0 w-0.5 bg-slate-200' aria-hidden='true' />}

      {/* Step icon circle */}
      <div className='relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5'>
        {step.error ? (
          <AlertCircle className='w-4 h-4 text-rose-600 shrink-0' />
        ) : isToolCall ? (
          <Wrench className='w-3.5 h-3.5 text-blue-600 shrink-0' />
        ) : (
          <Sparkles className='w-3.5 h-3.5 text-emerald-600 shrink-0' />
        )}
      </div>

      {/* Content card */}
      <div className='flex-1 pb-4 min-w-0'>
        <div
          onClick={() => hasExtraData && setIsExpanded(!isExpanded)}
          className={cn(
            "p-3 rounded-lg border border-slate-200 bg-white transition-colors",
            hasExtraData ? "cursor-pointer hover:border-slate-300 hover:bg-slate-50/50" : ""
          )}
        >
          {/* Header row */}
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2 min-w-0'>
              <span className='inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-700'>
                Step {step.step}
              </span>
              <div className='flex items-center gap-1.5'>
                <span
                  className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider",
                    isToolCall
                      ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                  )}
                >
                  {isToolCall ? `tool_call: ${step.tool || "function"}` : "final response"}
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2 shrink-0'>
              {step.durationMs !== undefined && (
                <span className='flex items-center gap-1 font-mono text-xs text-slate-400 tabular-nums'>
                  <Clock className='w-3 h-3' />
                  {step.durationMs}ms
                </span>
              )}
              {hasExtraData && (
                <button
                  type='button'
                  aria-label={isExpanded ? "Collapse step details" : "Expand step details"}
                  className='p-0.5 text-slate-400 hover:text-slate-600 transition-colors'
                >
                  {isExpanded ? <ChevronDown className='w-4 h-4' /> : <ChevronRight className='w-4 h-4' />}
                </button>
              )}
            </div>
          </div>

          {/* Reasoning */}
          {step.reasoning && <p className='mt-2 text-xs text-slate-700 leading-relaxed font-normal'>{step.reasoning}</p>}

          {/* Error notice if present */}
          {step.error && (
            <div className='mt-2 p-2 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs'>
              <strong>Error:</strong> {step.error}
            </div>
          )}

          {/* Collapsible Tool Arguments & Raw Output */}
          {hasExtraData && isExpanded && (
            <div className='mt-2.5 pt-2.5 border-t border-slate-100 space-y-2 text-xs'>
              {/* Tool Parameters */}
              {step.params !== undefined && (
                <div>
                  <div className='text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between'>
                    <span>Tool Arguments (`params`):</span>
                    <span className='font-mono text-[10px] text-slate-400'>JSON</span>
                  </div>
                  <pre className='p-2.5 rounded-md bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800'>
                    <code>{JSON.stringify(step.params, null, 2)}</code>
                  </pre>
                </div>
              )}

              {/* Raw Tool Output */}
              {step.rawOutput !== undefined && (
                <div>
                  <div className='text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between'>
                    <span>Tool Return Payload (`rawOutput`):</span>
                    <span className='font-mono text-[10px] text-slate-400'>JSON</span>
                  </div>
                  <pre className='p-2.5 rounded-md bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800'>
                    <code>{typeof step.rawOutput === "string" ? step.rawOutput : JSON.stringify(step.rawOutput, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
