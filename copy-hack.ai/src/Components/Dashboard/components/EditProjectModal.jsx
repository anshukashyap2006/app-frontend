import React, { useState, useEffect } from "react";
import apiClient from "../../../Api/api";

export function EditProjectModal({ isOpen, onClose, project, onSuccess }) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
      });
      setError(null);
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.patch(`/api/v1/projects/${project.id}`, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white tracking-tight">Edit Project</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                placeholder="e.g. Q4 Launch"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[100px] resize-y"
                placeholder="What is this project about?"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-[#BFFF00] text-zinc-900 text-sm font-semibold hover:bg-[#d4ff4d] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-zinc-900" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
