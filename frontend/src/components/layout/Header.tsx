import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  Loader2 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  isAgentProcessing: boolean;
  onOpenMobileSidebar: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isAgentProcessing,
  onOpenMobileSidebar,
  pendingCount,
}) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200 shrink-0">
      {/* Left zone: Mobile toggle & Title/Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
              Support Dashboard
            </h1>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-400">·</span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Production Pipeline</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block truncate">
            Review, triage, and resolve customer support tickets with AI.
          </p>
        </div>
      </div>

      {/* Right zone: Agent Status Indicator & Action Icons */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Agent Status Badge */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            isAgentProcessing
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          )}
        >
          {isAgentProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span className="font-semibold">Agent Processing...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold">Agent Ready</span>
            </>
          )}
        </div>

        {/* Notification Icon & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-semibold text-slate-900">
                <span>System Notifications</span>
                <span 
                  onClick={() => setShowNotificationMenu(false)}
                  className="text-[10px] text-indigo-600 cursor-pointer hover:underline"
                >
                  Close
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                  <div className="font-medium text-slate-900">3 Seed Tickets Queued</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Order inquiry, Enterprise upgrade, and Profile guidance ready for triage.
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                  <div className="font-medium text-slate-900">Tool Registry Verified</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    get_order_status and get_user_tier endpoints active.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-100 shadow-2xs">
            AV
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden lg:inline">
            Alex Vance
          </span>
        </div>
      </div>
    </header>
  );
};
