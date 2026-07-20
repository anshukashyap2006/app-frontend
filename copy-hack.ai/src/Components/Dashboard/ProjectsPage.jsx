import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../Api/api";
import { EditProjectModal } from "./components/EditProjectModal";

export function ProjectsPage({ setBreadcrumbs, onNewProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (setBreadcrumbs) {
      setBreadcrumbs([{ label: "Projects", path: "/dashboard/projects" }]);
    }
  }, [setBreadcrumbs]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/v1/projects/");
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/v1/projects/${deletingProject.id}`);
      setProjects(projects.filter(p => p.id !== deletingProject.id));
      setDeletingProject(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-zinc-500 font-mono">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-red-400 font-mono">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage all your workspaces and generation campaigns.</p>
        </div>
        <button 
          onClick={onNewProject}
          className="bg-[#BFFF00] text-zinc-950 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#a8e600] transition-colors shadow-[0_0_15px_rgba(191,255,0,0.2)]"
        >
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-10 text-center">
          <p className="text-zinc-500 text-sm mb-4">You haven't created any projects yet.</p>
          <button 
            onClick={onNewProject}
            className="text-[#BFFF00] hover:underline font-medium text-sm"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-zinc-900/60 border border-zinc-800/40 rounded-xl p-5 hover:border-[#BFFF00]/50 transition-colors cursor-pointer group flex flex-col"
              onClick={() => navigate(`/dashboard/projects/${project.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-medium truncate pr-4">{project.name}</h3>
                
                {/* Actions container - visible on hover */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setEditingProject(project)}
                    className="p-1.5 text-zinc-400 hover:text-[#BFFF00] transition-colors rounded-md hover:bg-zinc-800/80"
                    title="Edit Project"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => setDeletingProject(project)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors rounded-md hover:bg-red-950/30"
                    title="Delete Project"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-zinc-400 line-clamp-2 mb-6 flex-1">
                {project.description || "No description provided."}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/40">
                <span className="text-[11px] text-zinc-600 font-mono">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </span>
                
                {project.brand_brief?.name && (
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                    Brief: {project.brand_brief.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <EditProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        project={editingProject}
        onSuccess={(updatedProject) => {
          setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        }}
      />

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => !isDeleting && setDeletingProject(null)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Project?</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{deletingProject.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingProject(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
