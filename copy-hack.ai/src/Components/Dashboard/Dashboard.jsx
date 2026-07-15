import React, { useState, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./DashboardPage";
import { NewProjectModal } from "./components/NewProjectModal";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
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
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <DashboardPage dashboardState={dashboard} />
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

