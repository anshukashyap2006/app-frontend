import React, { useEffect, useState } from "react";
import apiClient from "../../../Api/api";

export function ViewBrandBriefModal({ isOpen, onClose, briefId }) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && briefId) {
      setLoading(true);
      setError(null);
      apiClient.get(`/api/v1/brand-briefs/${briefId}`)
        .then(res => setBrief(res.data))
        .catch(err => setError(err.response?.data?.detail || "Failed to load brand brief details."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, briefId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              {brief?.name || "Brand Brief Details"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#BFFF00] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              {error}
            </div>
          ) : brief ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Product/Service Name</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  {brief.product_name}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Product Description</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  {brief.product_description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Target Avatar</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 whitespace-pre-wrap">
                  {brief.target_avatar}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Key Objections</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 whitespace-pre-wrap">
                  {brief.key_objections || "Not specified."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Unique Mechanism</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 whitespace-pre-wrap">
                  {brief.unique_mechanism || "Not specified."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Competitor Notes</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 whitespace-pre-wrap">
                  {brief.competitor_notes || "Not specified."}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
