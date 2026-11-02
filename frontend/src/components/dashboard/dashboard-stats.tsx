import React from 'react';
import { Ticket } from '../../types/ticket';
import { Layers, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface DashboardStatsProps {
  tickets: Ticket[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ tickets }) => {
  const total = tickets.length;
  const pending = tickets.filter((t) => t.status === 'Pending' || t.status === 'Processing').length;
  const resolved = tickets.filter((t) => t.status === 'Resolved').length;
  const escalated = tickets.filter(
    (t) => t.result?.resolutionTag === 'Escalate to Sales'
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Total Tickets */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Total Tickets</span>
          <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
            {total}
          </span>
        </div>
      </div>

      {/* Pending */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Pending</span>
          <span className="text-base font-bold font-mono text-slate-700 tabular-nums">
            {pending}
          </span>
        </div>
      </div>

      {/* Resolved */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-emerald-700 block">Resolved</span>
          <span className="text-base font-bold font-mono text-emerald-700 tabular-nums">
            {resolved}
          </span>
        </div>
      </div>

      {/* Escalated */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-amber-700 block">Escalated</span>
          <span className="text-base font-bold font-mono text-amber-700 tabular-nums">
            {escalated}
          </span>
        </div>
      </div>
    </div>
  );
};
