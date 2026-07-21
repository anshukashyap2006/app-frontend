import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useLocation, Link } from "react-router-dom";

// Icons as inline SVG components for zero-dependency approach
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const FolderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const VoiceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path d="M19 10v2a7 7 0 01-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Profile color dots
const PROFILE_COLORS = ["#BFFF00", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#DDA0DD"];

export function Sidebar({ onNewProject, dashboardState }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Plan info
  const planName = dashboardState?.subscription?.plan_name || "Free";
  const used = dashboardState?.subscription?.generations_used || 0;
  const limit = dashboardState?.subscription?.generations_limit || 0;

  return (
    <aside className="w-[240px] min-w-[240px] h-full bg-zinc-950 border-r border-zinc-800/60 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-[#BFFF00] text-lg font-bold">&gt;_</span>
          <span className="text-white text-sm font-bold tracking-[0.08em] uppercase">
            CopyCraft
          </span>
        </Link>
      </div>

      {/* Scrollable nav area */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3">
        {/* Workspace section */}
        <div className="mb-5">
          <p className="px-2 mb-2 text-[10px] font-mono font-semibold tracking-[0.18em] text-zinc-600 uppercase">
            Workspace
          </p>
          <NavLink
            to="/dashboard"
            icon={<DashboardIcon />}
            label="Dashboard"
            active={isActive("/dashboard")}
          />
          <NavLink
            to="/dashboard/projects"
            icon={<FolderIcon />}
            label="Projects"
            active={isActive("/dashboard/projects")}
          />
        </div>

        {/* New Project button */}
        <div className="px-2 mb-6">
          <button
            onClick={onNewProject}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#BFFF00] text-zinc-900 text-sm font-semibold hover:bg-[#d4ff4d] active:bg-[#a8e600] transition-all duration-200 shadow-[0_0_20px_rgba(191,255,0,0.15)]"
            id="sidebar-new-project-btn"
          >
            <PlusIcon />
            New Project
          </button>
        </div>


        {/* My Library section */}
        <div className="mb-5">
          <p className="px-2 mb-2 text-[10px] font-mono font-semibold tracking-[0.18em] text-zinc-600 uppercase">
            My Library
          </p>
          <NavLink to="/dashboard/voice-profiles" icon={<VoiceIcon />} label="All Voice Profiles" active={isActive("/dashboard/voice-profiles")} />
          <NavLink to="/dashboard/generations" icon={<FileTextIcon />} label="All Generations" active={isActive("/dashboard/generations")} />
          <NavLink 
            to="/dashboard/sequences" 
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            } 
            label="All Sequences" 
            active={location.pathname.startsWith("/dashboard/sequences")} 
          />
          <NavLink to="/dashboard/brand-briefs" icon={<BriefcaseIcon />} label="Brand Briefs" active={isActive("/dashboard/brand-briefs")} />
          <NavLink to="/dashboard/social-posts" icon={<ShareIcon />} label="Social Media Posts" active={isActive("/dashboard/social-posts")} />
          <NavLink to="/dashboard/emails" icon={<MailIcon />} label="Emails" active={isActive("/dashboard/emails")} />
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-zinc-800/60 px-3 pt-3 pb-2">
        <NavLink to="/dashboard/settings" icon={<SettingsIcon />} label="Settings" active={isActive("/dashboard/settings")} />
        <NavLink to="/dashboard/help" icon={<HelpIcon />} label="Help & Support" active={isActive("/dashboard/help")} />
      </div>

      {/* Plan badge */}
      <div className="px-4 pb-5 pt-2">
        <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-xs font-semibold capitalize">{planName} Plan</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Generations</span>
            <span className="text-[#BFFF00] font-mono text-sm font-bold bg-[#BFFF00]/10 px-2 py-0.5 rounded-md">
              {used}<span className="text-zinc-500 text-xs font-medium">/{limit}</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function NavLink({ to, icon, label, active = false, badge = null }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150
        ${active
          ? "bg-zinc-800/70 text-white border-l-2 border-[#BFFF00] pl-[10px]"
          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
        }
      `}
    >
      <span className={active ? "text-[#BFFF00]" : ""}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge != null && (
        <span className="bg-zinc-800 text-zinc-400 text-[10px] font-mono px-1.5 py-0.5 rounded-md">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SidebarProfileItem({ name, color }) {
  return (
    <button className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors rounded-md hover:bg-zinc-900/50">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{name}</span>
    </button>
  );
}
