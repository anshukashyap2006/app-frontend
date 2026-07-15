import React, { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./DashboardPage";
import { ProjectPage } from "./ProjectPage";
import { GenerateEmailPage } from "./GenerateEmailPage";
import { GenerateSocialPostPage } from "./GenerateSocialPostPage";
import { PlanSequencePage } from "./PlanSequencePage";
import { NewProjectModal } from "./components/NewProjectModal";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const dashboard = useDashboard();

  const handleNewProject = useCallback(() => {
    setIsNewProjectOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsNewProjectOpen(false);
  }, []);

  const handleProjectCreated = useCallback(() => {
    // Reload the page to refresh dashboard data
    window.location.reload();
  }, []);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar onNewProject={handleNewProject} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<DashboardPage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="projects/:projectId" element={<ProjectPage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="generate/email" element={<GenerateEmailPage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="generate/social" element={<GenerateSocialPostPage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="generate/sequence" element={<PlanSequencePage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
          </Routes>
        </main>
      </div>

      {/* New Project Modal — rendered at root level for proper z-index stacking */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={handleClose}
        voiceProfiles={dashboard.voiceProfiles || []}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}

