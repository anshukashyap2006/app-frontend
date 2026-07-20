import React from "react";
import { Link } from "react-router-dom";

const ICONS = {
  email: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  social: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
      <path d="M22 2l-7 20-4-9-9-4z" />
      <line x1="22" y1="2" x2="11" y2="13" />
    </svg>
  ),
};

export function QuickActionCard({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  footerText,
}) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700/50 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 group">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center mb-4 group-hover:border-zinc-600/60 transition-colors">
        {ICONS[icon] || ICONS.email}
      </div>

      {/* Title */}
      <h3 className="text-white text-lg font-semibold mb-1.5 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-zinc-500 text-sm leading-relaxed mb-5">
        {description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {primaryAction && primaryAction.onClick ? (
          <button
            onClick={primaryAction.onClick}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#BFFF00] text-zinc-900 text-sm font-semibold hover:bg-[#d4ff4d] active:bg-[#a8e600] transition-all duration-200 shadow-[0_0_20px_rgba(191,255,0,0.12)] hover:shadow-[0_0_25px_rgba(191,255,0,0.2)]"
          >
            {primaryAction.label}
          </button>
        ) : primaryAction && (
          <Link
            to={primaryAction.href}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#BFFF00] text-zinc-900 text-sm font-semibold hover:bg-[#d4ff4d] active:bg-[#a8e600] transition-all duration-200 shadow-[0_0_20px_rgba(191,255,0,0.12)] hover:shadow-[0_0_25px_rgba(191,255,0,0.2)]"
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && secondaryAction.onClick ? (
          <button
            onClick={secondaryAction.onClick}
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-600 hover:text-white transition-all duration-200"
          >
            {secondaryAction.label}
          </button>
        ) : secondaryAction && (
          <Link
            to={secondaryAction.href}
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-600 hover:text-white transition-all duration-200"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>

      {/* Footer Text */}
      {footerText && (
        <div className="mt-6 pt-4 border-t border-zinc-800/40 text-center">
          <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
            {footerText}
          </p>
        </div>
      )}
    </div>
  );
}
