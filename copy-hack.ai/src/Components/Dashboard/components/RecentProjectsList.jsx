import React from "react";
import { Link } from "react-router-dom";

// Format a date string into a human-readable relative time
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
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return date.toLocaleDateString();
}

// Map generation format to a display badge
function formatBadge(format) {
  const styles = {
    email: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    social: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    vsl: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border ${
        styles[format] || styles.email
      }`}
    >
      {format}
    </span>
  );
}

// Determine status badge
function statusBadge(project) {
  // Infer status from project data
  const hasGenerations = project.generations && project.generations.length > 0;
  if (hasGenerations) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[#BFFF00]/10 text-[#BFFF00] border border-[#BFFF00]/20">
        Generated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-700/30 text-zinc-500 border border-zinc-700/40">
      Draft
    </span>
  );
}

const FolderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
);

export function RecentProjectsList({ projects, emptyMessage }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-8 text-center">
        <p className="text-zinc-600 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/dashboard/projects/${project.id}`}
          className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/40 rounded-xl px-4 py-3.5 hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all duration-200 group"
        >
          {/* Icon */}
          <div className="w-9 h-9 rounded-lg bg-zinc-800/60 border border-zinc-700/30 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-600/50 transition-colors">
            <FolderIcon />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-white text-sm font-medium truncate group-hover:text-zinc-100">
                {project.name}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {project.brand_brief && (
                <span className="text-[10px] text-zinc-600 font-mono truncate">
                  {project.brand_brief.product_name}
                </span>
              )}
              {statusBadge(project)}
            </div>
          </div>

          {/* Timestamp */}
          <span className="text-[11px] text-zinc-600 font-mono flex-shrink-0">
            {timeAgo(project.created_at)}
          </span>
        </Link>
      ))}
    </div>
  );
}
