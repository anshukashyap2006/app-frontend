import React, { useState, useEffect } from "react";
import apiClient from "../../../Api/api";

function arrayToCommaStr(arr) {
  return Array.isArray(arr) ? arr.join(", ") : "";
}

function arrayToNewlineStr(arr) {
  return Array.isArray(arr) ? arr.join("\n") : "";
}

function commaStrToArray(str) {
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

function newlineStrToArray(str) {
  return str.split("\n").map(s => s.trim()).filter(Boolean);
}

export function EditVoiceProfileModal({ isOpen, onClose, profile, onSuccess }) {
  const [formData, setFormData] = useState({
    profile_name: "",
    is_default: false,
    attributes: {
      tone_words: "",
      formality_level: "",
      sentence_style: "",
      power_words: "",
      avoided_phrases: "",
      cta_style: "",
      formats_used: "",
      emotional_temperature: "",
      example_phrases: "",
      prohibitions: "",
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        profile_name: profile.profile_name || "",
        is_default: profile.is_default || false,
        attributes: {
          tone_words: arrayToCommaStr(profile.attributes?.tone_words),
          power_words: arrayToCommaStr(profile.attributes?.power_words),
          avoided_phrases: arrayToCommaStr(profile.attributes?.avoided_phrases),
          formats_used: arrayToCommaStr(profile.attributes?.formats_used),
          example_phrases: arrayToNewlineStr(profile.attributes?.example_phrases),
          prohibitions: arrayToNewlineStr(profile.attributes?.prohibitions),
          formality_level: profile.attributes?.formality_level || "",
          sentence_style: profile.attributes?.sentence_style || "",
          cta_style: profile.attributes?.cta_style || "",
          emotional_temperature: profile.attributes?.emotional_temperature || "",
        }
      });
      setError(null);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profile_name.trim()) {
      setError("Please provide a profile name.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.patch(`/api/v1/voice/${profile.id}`, {
        profile_name: formData.profile_name.trim(),
        is_default: formData.is_default,
        attributes: {
          tone_words: commaStrToArray(formData.attributes.tone_words),
          power_words: commaStrToArray(formData.attributes.power_words),
          avoided_phrases: commaStrToArray(formData.attributes.avoided_phrases),
          formats_used: commaStrToArray(formData.attributes.formats_used),
          example_phrases: newlineStrToArray(formData.attributes.example_phrases),
          prohibitions: newlineStrToArray(formData.attributes.prohibitions),
          formality_level: formData.attributes.formality_level.trim(),
          sentence_style: formData.attributes.sentence_style.trim(),
          cta_style: formData.attributes.cta_style.trim(),
          emotional_temperature: formData.attributes.emotional_temperature.trim(),
        }
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update voice profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAttrChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white tracking-tight">Edit Voice Profile</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          <form id="edit-voice-form" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Profile Name & Default */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Profile Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.profile_name}
                    onChange={e => setFormData({ ...formData, profile_name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                    placeholder="e.g. Playful & Energetic"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800 h-[46px]">
                  <input
                    type="checkbox"
                    id="is-default-checkbox"
                    checked={formData.is_default}
                    onChange={e => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-700 text-[#BFFF00] focus:ring-[#BFFF00] focus:ring-offset-zinc-900 bg-zinc-800"
                  />
                  <label htmlFor="is-default-checkbox" className="text-sm font-medium text-white cursor-pointer select-none">
                    Set as Default Voice Profile
                  </label>
                </div>
              </div>

              <div className="border-t border-zinc-800/50 pt-5">
                <p className="text-[11px] font-mono font-semibold tracking-[0.15em] text-zinc-600 uppercase mb-4">
                  Voice Attributes
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                      Tone Words (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.attributes.tone_words}
                      onChange={e => handleAttrChange("tone_words", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                      placeholder="e.g. Bold, Witty, Conversational"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                      Power Words (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.attributes.power_words}
                      onChange={e => handleAttrChange("power_words", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                      placeholder="e.g. Revolutionary, Exclusive"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                      Avoided Phrases (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.attributes.avoided_phrases}
                      onChange={e => handleAttrChange("avoided_phrases", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                      placeholder="e.g. Synergize, Best in class"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                      Formats Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.attributes.formats_used}
                      onChange={e => handleAttrChange("formats_used", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                      placeholder="e.g. Bullet points, Short paragraphs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Formality Level
                  </label>
                  <input
                    type="text"
                    value={formData.attributes.formality_level}
                    onChange={e => handleAttrChange("formality_level", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                    placeholder="e.g. Casual"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Emotional Temperature
                  </label>
                  <input
                    type="text"
                    value={formData.attributes.emotional_temperature}
                    onChange={e => handleAttrChange("emotional_temperature", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                    placeholder="e.g. Warm and empathetic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Sentence Style
                  </label>
                  <input
                    type="text"
                    value={formData.attributes.sentence_style}
                    onChange={e => handleAttrChange("sentence_style", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                    placeholder="e.g. Short, punchy sentences"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    CTA Style
                  </label>
                  <input
                    type="text"
                    value={formData.attributes.cta_style}
                    onChange={e => handleAttrChange("cta_style", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                    placeholder="e.g. Direct and urgent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Example Phrases (one per line)
                  </label>
                  <textarea
                    value={formData.attributes.example_phrases}
                    onChange={e => handleAttrChange("example_phrases", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[100px] resize-y"
                    placeholder="Let's dive in...&#10;Here's the deal..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                    Prohibitions (one per line)
                  </label>
                  <textarea
                    value={formData.attributes.prohibitions}
                    onChange={e => handleAttrChange("prohibitions", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[100px] resize-y"
                    placeholder="No emojis&#10;Never use passive voice"
                  />
                </div>
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
            form="edit-voice-form"
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
