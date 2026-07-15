import React from "react";
import { Link } from "react-router-dom";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

function formatLabel(format) {
  const labels = {
    email: "Email",
    social: "Social",
    vsl: "VSL",
  };
  return labels[format] || format;
}

const FORMAT_ICONS = {
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  social: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  vsl: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
};

// Score color utility
function scoreColor(score) {
  if (score >= 80) return "bg-[#BFFF00]";
  if (score >= 60) return "bg-yellow-400";
  return "bg-orange-400";
}

export function RecentGenerationsList({ generations, emptyMessage }) {
  if (!generations || generations.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-8 text-center">
        <p className="text-zinc-600 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {generations.map((gen) => {
        // Try to extract a preview text from the generation
        const subType = gen.sub_type || gen.format;
        const platform = gen.platform;
        const preview = gen.sub_type
          ? `${formatLabel(gen.format)} · ${gen.sub_type}`
          : formatLabel(gen.format);

        // Critic score if available (from latest version)
        const criticScore = gen.latest_version?.critic_scores?.overall
          ?? gen.versions?.[0]?.critic_scores?.overall
          ?? null;

        return (
          <Link
            key={gen.id}
            to={`/dashboard/generations/${gen.id}`}
            className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/40 rounded-xl px-4 py-3.5 hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-200 group"
          >
            {/* Format icon */}
            <div className="w-9 h-9 rounded-lg bg-zinc-800/60 border border-zinc-700/30 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-600/50 transition-colors">
              {FORMAT_ICONS[gen.format] || FORMAT_ICONS.email}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate group-hover:text-zinc-100 mb-0.5">
                {gen.sub_type || formatLabel(gen.format)}
              </p>
              <div className="flex items-center gap-2">
                {criticScore !== null && (
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 rounded-full ${scoreColor(criticScore * 10)}`} style={{ width: `${criticScore * 10}%`, minWidth: "12px", maxWidth: "40px" }} />
                    <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                      {criticScore * 10}/100
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-zinc-600 font-mono capitalize">
                  {formatLabel(gen.format)}
                </span>
                {platform && (
                  <>
                    <span className="text-zinc-700 text-[10px]">·</span>
                    <span className="text-[10px] text-zinc-600 font-mono capitalize">
                      {platform}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Timestamp */}
            <span className="text-[11px] text-zinc-600 font-mono flex-shrink-0">
              {timeAgo(gen.created_at)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
