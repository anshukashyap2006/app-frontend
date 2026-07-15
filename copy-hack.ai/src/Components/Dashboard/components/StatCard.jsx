import React from "react";

export function StatCard({ label, value, trend }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/60 transition-all duration-200 group">
      {/* Label */}
      <p className="text-[10px] font-mono font-semibold tracking-[0.15em] text-zinc-600 uppercase mb-2">
        {label}
      </p>

      {/* Value + trend */}
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-white tracking-tight leading-none group-hover:text-zinc-100 transition-colors">
          {value}
        </span>
        {trend && (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#BFFF00]/10 text-[#BFFF00] text-[11px] font-mono font-semibold mb-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            </svg>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
