import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../Api/api";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { QuickActionCard } from "./components/QuickActionCard";
import { RecentGenerationsList } from "./components/RecentGenerationsList";
import { EditProjectModal } from "./components/EditProjectModal";

// Format date helper
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }
  return "just now";
}

export function ProjectPage({ dashboardState, setBreadcrumbs }) {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [generations, setGenerations] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProjectData() {
      try {
        setLoading(true);
        const [projRes, genRes] = await Promise.all([
          apiClient.get(`/api/v1/projects/${projectId}`),
          apiClient.get(`/api/v1/projects/${projectId}/generations`),
        ]);

        setProject(projRes.data);
        setGenerations(genRes.data);

        if (setBreadcrumbs) {
          setBreadcrumbs([
            { label: "Projects", href: "/dashboard" },
            { label: projRes.data.name },
          ]);
        }
      } catch (err) {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId, setBreadcrumbs]);

  if (loading) return <DashboardSkeleton />;

  if (error) {
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
  }

  if (!project) return null;

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            {project.name}
          </h1>
          <p className="text-zinc-400 text-sm mb-4 max-w-2xl">
            {project.description || "No description provided."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {project.brand_brief && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-400"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M8 7h6" />
                  <path d="M8 11h8" />
                </svg>
                <span className="text-xs font-medium text-zinc-300">
                  {project.brand_brief.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50">
              <span className="text-xs font-medium text-zinc-400">
                Created: {timeAgo(project.created_at)}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800 shrink-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
          Edit Project
        </button>
      </div>

      {/* What are you writing? */}
      <h2 className="text-[14px] font-bold text-white tracking-tight mb-4">
        What are you writing?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <QuickActionCard
          icon="email"
          title="Email Copy"
          description="Individual send or full sequence"
          primaryAction={{
            label: "Generate an Email",
            href: `/dashboard/generate/email?projectId=${project.id}`,
          }}
          secondaryAction={{
            label: "Plan a Sequence",
            href: `/dashboard/generate/sequence?projectId=${project.id}`,
          }}
        />
        <QuickActionCard
          icon="social"
          title="Social Media"
          description="Instagram, LinkedIn, YouTube, Twitter"
          primaryAction={{
            label: "Generate Posts",
            href: `/dashboard/generate/social?projectId=${project.id}`,
          }}
        />
      </div>

      {/* Recent Generations */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800/60 pb-2">
          <h2 className="text-[14px] font-bold text-white tracking-tight">
            Recent Generations
          </h2>
          <a
            href={`/dashboard/generations?projectId=${project.id}`}
            className="text-[11px] font-mono text-[#BFFF00] hover:text-white transition-colors duration-150"
          >
            View All {generations.length} →
          </a>
        </div>

        <RecentGenerationsList
          generations={generations}
          emptyMessage="No generations for this project yet. Pick a format above."
        />
      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSuccess={(updatedProject) => {
          setProject(updatedProject);
          if (setBreadcrumbs) {
            setBreadcrumbs([
              { label: "Projects", href: "/dashboard" },
              { label: updatedProject.name },
            ]);
          }
        }}
      />
    </div>
  );
}
