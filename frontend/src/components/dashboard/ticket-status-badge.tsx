import React from 'react';
import { TicketStatus, ResolutionTag } from '../../types/ticket';
import { cn } from '../../lib/utils';
import { CheckCircle2, Clock, Loader2, ArrowUpRight } from 'lucide-react';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({
  status,
  className,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (status === 'Processing') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200/80',
          sizeClasses,
          className
        )}
      >
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
        Processing
      </span>
    );
  }

  if (status === 'Resolved') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80',
          sizeClasses,
          className
        )}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Resolved
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200/80',
        sizeClasses,
        className
      )}
    >
      <Clock className="w-3 h-3 text-slate-500" />
      Pending
    </span>
  );
};

interface ResolutionBadgeProps {
  tag: ResolutionTag;
  className?: string;
  size?: 'sm' | 'md';
}

export const ResolutionBadge: React.FC<ResolutionBadgeProps> = ({
  tag,
  className,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (tag === 'Escalate to Sales') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs',
          sizeClasses,
          className
        )}
      >
        <ArrowUpRight className="w-3 h-3 text-amber-600" />
        Escalate to Sales
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs',
        sizeClasses,
        className
      )}
    >
      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
      Auto-Resolve
    </span>
  );
};
