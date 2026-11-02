import React from 'react';
import { 
  Bot, 
  Inbox, 
  UserCircle, 
  Shield, 
  X 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SideBarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
  pendingCount: number;
}

export const SideBar: React.FC<SideBarProps> = ({
  isOpenOnMobile,
  onCloseMobile,
  pendingCount,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-300 transition-transform duration-200 ease-in-out md:static md:translate-x-0 shrink-0 border-r border-slate-800',
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">
                SupportDesk
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 block -mt-0.5">
                Agent AI Core
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list - only Tickets */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Triage Queue
          </div>

          <div
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm cursor-default"
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4 text-white" />
              <span>Tickets</span>
            </div>

            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] font-semibold tabular-nums bg-indigo-700 text-white">
                {pendingCount}
              </span>
            )}
          </div>
        </nav>

        {/* Autonomous Safety Notice */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-lg bg-slate-800/50 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autonomous Safety</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Escalates high-value tier requests and validates tool execution before customer dispatch.
          </p>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/60 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 border border-slate-600">
              <UserCircle className="w-6 h-6 text-slate-300" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-white block truncate">
                Alex Vance
              </span>
              <span className="text-[11px] text-slate-400 block truncate">
                Senior Support Lead
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
