import React, { useState, useEffect } from "react";
import apiClient from "../../../Api/api";

export function EditBrandBriefModal({ isOpen, onClose, brief, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    product_name: "",
    product_description: "",
    target_avatar: "",
    key_objections: "",
    unique_mechanism: "",
    competitor_notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brief) {
      setFormData({
        name: brief.name || "",
        product_name: brief.product_name || "",
        product_description: brief.product_description || "",
        target_avatar: brief.target_avatar || "",
        key_objections: brief.key_objections || "",
        unique_mechanism: brief.unique_mechanism || "",
        competitor_notes: brief.competitor_notes || "",
      });
      setError(null);
    }
  }, [brief, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.product_name.trim() || !formData.product_description.trim() || !formData.target_avatar.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.patch(`/api/v1/brand-briefs/${brief.id}`, {
        name: formData.name.trim(),
        product_name: formData.product_name.trim(),
        product_description: formData.product_description.trim(),
        target_avatar: formData.target_avatar.trim(),
        key_objections: formData.key_objections.trim() || null,
        unique_mechanism: formData.unique_mechanism.trim() || null,
        competitor_notes: formData.competitor_notes.trim() || null,
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update brand brief.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white tracking-tight">Edit Brand Brief</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          <form id="edit-brief-form" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Brief Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                    placeholder="e.g. Q4 Launch Brief"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Product/Service Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.product_name}
                    onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                    placeholder="e.g. Acme CRM"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                  Product Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.product_description}
                  onChange={e => setFormData({ ...formData, product_description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[100px] resize-y"
                  placeholder="What does it do? What are the main benefits?"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                  Target Avatar <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.target_avatar}
                  onChange={e => setFormData({ ...formData, target_avatar: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[80px] resize-y"
                  placeholder="Who are we selling to? Pain points? Desires?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Key Objections (Optional)
                  </label>
                  <textarea
                    value={formData.key_objections}
                    onChange={e => setFormData({ ...formData, key_objections: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[80px] resize-y"
                    placeholder="What stops them from buying?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Unique Mechanism (Optional)
                  </label>
                  <textarea
                    value={formData.unique_mechanism}
                    onChange={e => setFormData({ ...formData, unique_mechanism: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[80px] resize-y"
                    placeholder="How does it work differently?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                  Competitor Notes (Optional)
                </label>
                <textarea
                  value={formData.competitor_notes}
                  onChange={e => setFormData({ ...formData, competitor_notes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[80px] resize-y"
                  placeholder="Who else are they looking at? How are we better?"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-5 border-t border-zinc-800 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-brief-form"
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
      </div>
    </div>
  );
}
