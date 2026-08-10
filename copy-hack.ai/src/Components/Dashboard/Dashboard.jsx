import React, { useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./DashboardPage";
import { ProjectsPage } from "./ProjectsPage";
import { ProjectPage } from "./ProjectPage";
import { GenerateEmailPage } from "./GenerateEmailPage";
import { GenerateSocialPostPage } from "./GenerateSocialPostPage";
import { PlanSequencePage } from "./PlanSequencePage";
import { VoiceProfilesPage } from "./VoiceProfilesPage";
import { BrandBriefsPage } from "./BrandBriefsPage";
import { GenerationsPage } from "./GenerationsPage";
import { GenerationDetailPage } from "./GenerationDetailPage";
import { VoiceProfileSetup } from "./components/VoiceProfileSetup";
import { VoiceProfileUploadPage } from "./VoiceProfileUploadPage";
import { SequencesPage } from "./SequencesPage";
import { SequenceDetailPage } from "./SequenceDetailPage";
import { SettingsPage } from "./SettingsPage";
import { HelpCenterPage } from "./HelpCenterPage";
import { NewProjectModal } from "./components/NewProjectModal";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dashboard = useDashboard();

  const handleNewProject = useCallback(() => {
    setIsNewProjectOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsNewProjectOpen(false);
  }, []);

  const navigate = useNavigate();

  const handleProjectCreated = useCallback((newProject) => {
    navigate(`/dashboard/projects/${newProject.id}`);
    setIsNewProjectOpen(false);
  }, [navigate]);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar onNewProject={handleNewProject} dashboardState={dashboard} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar breadcrumbs={breadcrumbs} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<DashboardPage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} onNewProject={handleNewProject} />} />
            <Route path="projects" element={<ProjectsPage setBreadcrumbs={setBreadcrumbs} onNewProject={handleNewProject} />} />
            <Route path="projects/:projectId" element={<ProjectPage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="generate/email" element={<GenerateEmailPage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="generate/social" element={<GenerateSocialPostPage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="generate/sequence" element={<PlanSequencePage dashboardState={dashboard} setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="voice-profiles" element={<VoiceProfilesPage setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="voice-profiles/new" element={<VoiceProfileSetup />} />
            <Route path="voice/create" element={<VoiceProfileUploadPage setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="brand-briefs" element={<BrandBriefsPage setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="generations" element={<GenerationsPage setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="social-posts" element={<GenerationsPage filter="social" setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="emails" element={<GenerationsPage filter="email" setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="sequences" element={<SequencesPage setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="sequences/:sequenceId" element={<SequenceDetailPage setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="generations/:generationId" element={<GenerationDetailPage setBreadcrumbs={setBreadcrumbs} />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpCenterPage />} />
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

