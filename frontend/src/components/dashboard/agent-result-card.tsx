import React, { useState } from 'react';
import { TriageResult } from '../../types/ticket';
import { ResolutionBadge } from './ticket-status-badge';
import { ExecutionTrace } from './execution-trace';
import { copyToClipboard } from '../../lib/utils';
import { 
  Copy, 
  Check, 
  Send, 
  Edit3, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MessageSquareQuote,
  CheckCheck,
  FileText
} from 'lucide-react';

interface AgentResultCardProps {
  result: TriageResult;
  ticketId: string;
  onSendReply?: (reply: string) => void;
}

export const AgentResultCard: React.FC<AgentResultCardProps> = ({
  result,
  ticketId,
  onSendReply,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedResponse, setEditedResponse] = useState<string>(result.customerResponse);

  const handleCopy = async () => {
    const success = await copyToClipboard(editedResponse);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSend = () => {
    setSent(true);
    onSendReply?.(editedResponse);
    setTimeout(() => {
      setSent(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Main AI Triage Result Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        {/* Header with Title and Resolution Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                AI Triage Result
              </h3>
              <p className="text-xs text-slate-500">
                Automated recommendation & response draft
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Resolution Action:
            </span>
            <ResolutionBadge tag={result.resolutionTag} size="md" />
          </div>
        </div>

        {/* High-level reasoning statement */}
        {result.reasoning && (
          <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-0.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Triage Decision Reasoning:</span>
            </div>
            {result.reasoning}
          </div>
        )}

        {/* Customer Response Draft Panel */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
              <span>Customer Response Draft</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                title="Edit response draft"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Done' : 'Edit'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Response</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response text body */}
          {isEditing ? (
            <textarea
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              rows={4}
              className="w-full p-3.5 rounded-lg border border-indigo-300 bg-indigo-50/20 text-slate-900 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/30 leading-relaxed resize-y"
            />
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/90 text-slate-800 text-sm leading-relaxed font-normal selection:bg-indigo-100 selection:text-indigo-900">
              {editedResponse}
            </div>
          )}

          {/* Action Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Validated output
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 tabular-nums font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {result.totalMs}ms latency
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={sent}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-80 cursor-pointer"
              >
                {sent ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Sent to Customer</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Trace Accordion / Collapsible */}
      <ExecutionTrace
        trace={result.trace}
        totalMs={result.totalMs}
        ticketId={ticketId}
        defaultExpanded={false}
      />
    </div>
  );
};
