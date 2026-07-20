import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../Api/api";
import { EditVoiceProfileModal } from "./components/EditVoiceProfileModal";
import { ViewVoiceProfileModal } from "./components/ViewVoiceProfileModal";

export function VoiceProfilesPage({ setBreadcrumbs }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [viewingProfileId, setViewingProfileId] = useState(null);
  const [deletingProfile, setDeletingProfile] = useState(null);

  const handleSetDefault = async (e, profileId) => {
    e.stopPropagation();
    try {
      await apiClient.patch(`/api/v1/voice/${profileId}/default`);
      setProfiles(profiles.map(p => ({
        ...p,
        is_default: p.id === profileId
      })));
    } catch (err) {
      console.error("Error setting default profile:", err);
    }
  };

  const handleDelete = async () => {
    if (!deletingProfile) return;
    try {
      await apiClient.delete(`/api/v1/voice/${deletingProfile.id}`);
      setProfiles(profiles.filter(p => p.id !== deletingProfile.id));
      setDeletingProfile(null);
    } catch (err) {
      console.error("Error deleting profile:", err);
    }
  };

  useEffect(() => {
    if (setBreadcrumbs) {
      setBreadcrumbs([{ label: "Voice Profiles", path: "/dashboard/voice-profiles" }]);
    }
  }, [setBreadcrumbs]);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await apiClient.get("/api/v1/voice/");
        setProfiles(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-zinc-500 font-mono">Loading profiles...</p>
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Voice Profiles</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage the voices that define your brand's unique identity.</p>
        </div>
        <Link to="/dashboard/voice-profiles/new" className="bg-[#BFFF00] text-zinc-950 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#a8e600] transition-colors shadow-[0_0_15px_rgba(191,255,0,0.2)]">
          + New Profile
        </Link>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-10 text-center">
          <p className="text-zinc-500 text-sm">No voice profiles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => {
            const toneWords = profile.attributes?.tone_words || [];

            return (
              <div 
                key={profile.id} 
                className="bg-zinc-900/60 border border-zinc-800/40 rounded-xl p-5 hover:border-[#BFFF00]/50 transition-colors cursor-pointer relative"
                onClick={() => setViewingProfileId(profile.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{profile.profile_name}</h3>
                  {profile.is_default && (
                    <span className="bg-[#BFFF00]/20 text-[#BFFF00] text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </div>
                
                <div className="mb-4 min-h-[28px]">
                  {toneWords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {toneWords.slice(0, 5).map((word) => (
                        <span
                          key={word}
                          className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-700/30"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">No tone words available.</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                  <span className="text-[11px] text-zinc-600 font-mono">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-3">
                    {!profile.is_default && profiles.length > 1 && (
                      <button 
                        onClick={(e) => handleSetDefault(e, profile.id)}
                        className="text-zinc-400 text-[11px] font-medium hover:text-white transition-colors z-10"
                      >
                        Set Default
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProfile(profile);
                      }}
                      className="text-[#BFFF00] text-xs font-medium hover:underline z-10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingProfile(profile);
                      }}
                      className="text-zinc-500 hover:text-red-500 transition-colors z-10"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EditVoiceProfileModal
        isOpen={!!editingProfile}
        onClose={() => setEditingProfile(null)}
        profile={editingProfile}
        onSuccess={(updatedProfile) => {
          setProfiles(profiles.map(p => {
            if (updatedProfile.is_default && p.id !== updatedProfile.id) {
              return { ...p, is_default: false };
            }
            if (p.id === updatedProfile.id) {
              return updatedProfile;
            }
            return p;
          }));
        }}
      />

      <ViewVoiceProfileModal
        isOpen={!!viewingProfileId}
        onClose={() => setViewingProfileId(null)}
        profileId={viewingProfileId}
      />

      {/* Delete Confirmation Modal */}
      {deletingProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">Delete Voice Profile?</h3>
            <p className="text-zinc-400 mb-6 text-sm">
              Are you sure you want to delete the voice profile <span className="text-white font-medium">"{deletingProfile.profile_name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingProfile(null)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
