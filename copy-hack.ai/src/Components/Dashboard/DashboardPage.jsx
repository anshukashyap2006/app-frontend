import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { VoiceProfileSetup } from "./components/VoiceProfileSetup";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { StatCard } from "./components/StatCard";
import { GenerationsLeftCard } from "./components/GenerationsLeftCard";
import { QuickActionCard } from "./components/QuickActionCard";
import { RecentProjectsList } from "./components/RecentProjectsList";
import { RecentGenerationsList } from "./components/RecentGenerationsList";



export function DashboardPage({ dashboardState, setBreadcrumbs, onNewProject }) {
  useEffect(() => {
    if (setBreadcrumbs) {
      setBreadcrumbs(null);
    }
  }, [setBreadcrumbs]);

  const {
    loading,
    error,
    user,
    subscription,
    voiceProfiles,
    projects,
    recentGenerations,
    stats,
  } = dashboardState;

 
  // State 1 — Loading
  if (loading) return <DashboardSkeleton />;
 
  // Error
  if (error)
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 text-sm font-mono uppercase tracking-widest mb-2">
            Error
          </p>
          <p className="text-zinc-400 text-sm">{error}</p>
        </div>
      </div>
    );
 
  // State 2 — New user, no voice profiles
  if (voiceProfiles.length === 0) return <VoiceProfileSetup />;
 
  // State 3 — Active user
  const greeting = getGreeting();
 
  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10">
 
      {/* Greeting */}
      <h1 className="text-2xl font-semibold text-white mb-8 tracking-tight">
        {greeting},{" "}
        <span className="text-zinc-300">
          {user.full_name?.split(" ")[0] ?? "there"}.
        </span>
      </h1>
 
      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <GenerationsLeftCard
          used={stats.generationsUsed}
          limit={stats.generationsLimit}
          left={stats.generationsLeft}
        />
        <StatCard label="PROJECTS" value={stats.projectCount} />
        <StatCard label="VOICE PROFILES" value={stats.voiceProfileCount} />
        <StatCard
          label="THIS MONTH'S COPIES"
          value={stats.thisMonthCopies}
          trend="+12%"
        />
      </div>
 
      {/* Quick actions */}
      <p className="text-[11px] font-mono font-medium tracking-[0.15em] text-zinc-500 uppercase mb-4">
        What are you writing today?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <QuickActionCard
          icon="email"
          title="Email Copy"
          description="Individual email or full sequence optimized for clicks and replies."
          primaryAction={{ label: "Generate an Email", onClick: onNewProject }}
          secondaryAction={{ label: "Plan a Sequence", onClick: onNewProject }}
        />
        <QuickActionCard
          icon="social"
          title="Social Media Posts"
          description="Hooks, threads, and posts for Twitter, LinkedIn, and Instagram."
          primaryAction={{ label: "Generate Posts", onClick: onNewProject }}
        />
      </div>
 
      {/* Recent content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-mono font-medium tracking-[0.15em] text-zinc-500 uppercase">
              Recent Projects
            </p>
            <Link
              to="/dashboard/projects"
              className="text-[11px] font-mono text-[#BFFF00] hover:text-white transition-colors duration-150"
            >
              View All →
            </Link>
          </div>
          <RecentProjectsList
            projects={projects.slice(0, 3)}
            emptyMessage="No projects yet. Create one to get started."
          />
        </div>
 
        {/* Recent Generations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-mono font-medium tracking-[0.15em] text-zinc-500 uppercase">
              Recent Generations
            </p>
            <Link
              to="/dashboard/generations"
              className="text-[11px] font-mono text-[#BFFF00] hover:text-white transition-colors duration-150"
            >
              View All →
            </Link>
          </div>
          <RecentGenerationsList
            generations={recentGenerations}
            emptyMessage="No generations yet. Pick a format above."
          />
        </div>
 
      </div>
    </div>
  );
}
 
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}