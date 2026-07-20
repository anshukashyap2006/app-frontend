import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../Api/api";

const TYPE_COLORS = {
  welcome: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  sales: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  broadcast: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
};

const STATUS_COLORS = {
  complete: { bg: "bg-[#BFFF00]/10", border: "border-[#BFFF00]/30", text: "text-[#BFFF00]" },
  planning: { bg: "bg-zinc-800/50", border: "border-zinc-700", text: "text-zinc-400" },
  generating: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
};

export function SequencesPage({ setBreadcrumbs }) {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (setBreadcrumbs) {
      setBreadcrumbs([{ label: "All Sequences", path: "/dashboard/sequences" }]);
    }
  }, [setBreadcrumbs]);

  useEffect(() => {
    async function fetchSequences() {
      try {
        const res = await apiClient.get("/api/v1/sequences/");
        setSequences(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSequences();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this sequence and all its emails?")) return;

    try {
      await apiClient.delete(`/api/v1/sequences/${id}`);
      setSequences(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete sequence: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-zinc-500 font-mono">Loading sequences...</p>
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">All Sequences</h1>
          <p className="text-sm text-zinc-400 mt-1">View and manage all your email sequences across projects.</p>
        </div>
      </div>

      {sequences.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-10 text-center">
          <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <p className="text-zinc-500 text-sm mb-1">No sequences yet.</p>
          <p className="text-zinc-600 text-xs">Create a sequence from any project page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sequences.map((seq) => {
            const typeCfg = TYPE_COLORS[seq.sequence_type] || TYPE_COLORS.welcome;
            const statusCfg = STATUS_COLORS[seq.status] || STATUS_COLORS.planning;
            const name = seq.sequence_plan?.sequence_name || `${seq.sequence_type} sequence`;

            return (
              <Link
                key={seq.id}
                to={`/dashboard/sequences/${seq.id}`}
                className="bg-zinc-900/60 border border-zinc-800/40 rounded-xl p-5 hover:border-[#BFFF00]/50 transition-all duration-200 group relative block"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium text-sm leading-snug pr-8 group-hover:text-[#BFFF00] transition-colors">
                    {name}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(e, seq.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors z-10 shrink-0"
                    title="Delete Sequence"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${typeCfg.bg} ${typeCfg.border} ${typeCfg.text}`}>
                    {seq.sequence_type}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}>
                    {seq.status}
                  </span>
                  {seq.audience_awareness && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border border-orange-500/30 bg-orange-500/10 text-orange-400">
                      {seq.audience_awareness}
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-mono">
                      {seq.total_emails || "—"} emails
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-600 font-mono">
                    {new Date(seq.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
