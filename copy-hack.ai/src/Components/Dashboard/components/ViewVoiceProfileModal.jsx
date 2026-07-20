import React, { useEffect, useState } from "react";
import apiClient from "../../../Api/api";

export function ViewVoiceProfileModal({ isOpen, onClose, profileId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && profileId) {
      setLoading(true);
      setError(null);
      apiClient.get(`/api/v1/voice/${profileId}`)
        .then(res => setProfile(res.data))
        .catch(err => setError(err.response?.data?.detail || "Failed to load voice profile details."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, profileId]);

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
              {profile?.profile_name || "Voice Profile Details"}
              {profile?.is_default && (
                <span className="bg-[#BFFF00]/20 text-[#BFFF00] text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Default
                </span>
              )}
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
          ) : profile ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Tone Words</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.attributes.tone_words?.map((word, idx) => (
                      <span key={idx} className="inline-flex px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Power Words</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.attributes.power_words?.map((word, idx) => (
                      <span key={idx} className="inline-flex px-2.5 py-1 rounded-md text-xs font-mono bg-[#BFFF00]/10 border border-[#BFFF00]/20 text-[#BFFF00]">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Avoided Phrases</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.attributes.avoided_phrases?.map((word, idx) => (
                      <span key={idx} className="inline-flex px-2.5 py-1 rounded-md text-xs font-mono bg-red-500/10 border border-red-500/20 text-red-400">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Formats Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.attributes.formats_used?.map((word, idx) => (
                      <span key={idx} className="inline-flex px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Formality Level</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  {profile.attributes.formality_level || "Not specified."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Sentence Style</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  {profile.attributes.sentence_style || "Not specified."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">CTA Style</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  {profile.attributes.cta_style || "Not specified."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Emotional Temperature</h4>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  {profile.attributes.emotional_temperature || "Not specified."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Example Phrases</h4>
                <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1.5 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  {profile.attributes.example_phrases?.map((phrase, idx) => (
                    <li key={idx}>{phrase}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Prohibitions</h4>
                <ul className="list-disc list-inside text-sm text-red-300 space-y-1.5 bg-red-950/20 p-3 rounded-lg border border-red-900/30">
                  {profile.attributes.prohibitions?.map((phrase, idx) => (
                    <li key={idx}>{phrase}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
