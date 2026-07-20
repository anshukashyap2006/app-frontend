import React, { useEffect, useState } from "react";
import apiClient from "../../Api/api";
import { EditBrandBriefModal } from "./components/EditBrandBriefModal";
import { ViewBrandBriefModal } from "./components/ViewBrandBriefModal";

export function BrandBriefsPage({ setBreadcrumbs }) {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBrief, setEditingBrief] = useState(null);
  const [viewingBriefId, setViewingBriefId] = useState(null);

  useEffect(() => {
    if (setBreadcrumbs) {
      setBreadcrumbs([{ label: "Brand Briefs", path: "/dashboard/brand-briefs" }]);
    }
  }, [setBreadcrumbs]);

  useEffect(() => {
    async function fetchBriefs() {
      try {
        const res = await apiClient.get("/api/v1/brand-briefs/");
        setBriefs(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBriefs();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this brand brief?")) return;
    
    try {
      await apiClient.delete(`/api/v1/brand-briefs/${id}`);
      setBriefs(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert("Failed to delete brand brief: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-zinc-500 font-mono">Loading brand briefs...</p>
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Brand Briefs</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage core information about your products, services, and company.</p>
        </div>
      </div>

      {briefs.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-10 text-center">
          <p className="text-zinc-500 text-sm">No brand briefs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {briefs.map((brief) => (
            <div 
              key={brief.id} 
              className="bg-zinc-900/60 border border-zinc-800/40 rounded-xl p-5 hover:border-[#BFFF00]/50 transition-colors cursor-pointer relative"
              onClick={() => setViewingBriefId(brief.id)}
            >
              <h3 className="text-white font-medium mb-3">{brief.name}</h3>
              <p className="text-sm text-zinc-400 line-clamp-3 mb-4">
                {brief.product_description || "No description provided."}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-600 font-mono">
                  {new Date(brief.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBrief(brief);
                    }}
                    className="text-[#BFFF00] text-xs font-medium hover:underline z-10"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, brief.id)}
                    className="text-red-400 hover:text-red-300 transition-colors z-10 flex items-center justify-center"
                    title="Delete Brand Brief"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditBrandBriefModal
        isOpen={!!editingBrief}
        onClose={() => setEditingBrief(null)}
        brief={editingBrief}
        onSuccess={(updatedBrief) => {
          setBriefs(briefs.map(b => b.id === updatedBrief.id ? updatedBrief : b));
        }}
      />

      <ViewBrandBriefModal
        isOpen={!!viewingBriefId}
        onClose={() => setViewingBriefId(null)}
        briefId={viewingBriefId}
      />
    </div>
  );
}
