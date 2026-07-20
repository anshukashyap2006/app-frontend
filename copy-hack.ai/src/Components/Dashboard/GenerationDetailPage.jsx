import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../Api/api";
import { EmailResultView } from "./components/EmailResultView";
import { SocialPostResultView } from "./components/SocialPostResultView";

export function GenerationDetailPage({ setBreadcrumbs }) {
  const { generationId } = useParams();
  const navigate = useNavigate();
  const [generation, setGeneration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGeneration() {
      try {
        const res = await apiClient.get(`/api/v1/generations/${generationId}`);
        setGeneration(res.data);

        if (setBreadcrumbs) {
          setBreadcrumbs([
            { label: "Generations", path: "/dashboard/generations" },
            { label: res.data.sub_type || res.data.format || "Details", path: `/dashboard/generations/${generationId}` }
          ]);
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGeneration();
  }, [generationId, setBreadcrumbs]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRegenerate = async () => {
    if (!generation) return;

    try {
      if (generation.format === "social") {
        const res = await apiClient.post(`/api/v1/generations/${generationId}/regenerate`);
        // Refresh data
        const updatedGen = await apiClient.get(`/api/v1/generations/${generationId}`);
        setGeneration(updatedGen.data);
      } else if (generation.format === "email" && generation.email_sequence_id && generation.sequence_position) {
        // Hit the specific sequence email regenerate endpoint
        const res = await apiClient.post(`/api/v1/sequences/${generation.email_sequence_id}/emails/${generation.sequence_position}/regenerate`);
        // Refresh data
        const updatedGen = await apiClient.get(`/api/v1/generations/${generationId}`);
        setGeneration(updatedGen.data);
      } else {
        alert("Regeneration for this format from detail view is not fully implemented here yet.");
      }
    } catch (err) {
      alert("Error regenerating: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-zinc-500 font-mono">Loading generation details...</p>
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

  const latestVersion = generation?.latest_version || (generation?.versions?.length > 0 ? generation.versions[generation.versions.length - 1] : null);

  if (!generation || !latestVersion) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center flex-col gap-4">
        <p className="text-zinc-500 font-mono">No generation content found.</p>
        <button onClick={handleBack} className="text-sm text-zinc-400 hover:text-white transition-colors underline">Go Back</button>
      </div>
    );
  }

  if (generation.format === "email") {
    return (
      <EmailResultView
        result={latestVersion}
        onBack={handleBack}
        onRegenerate={handleRegenerate}
        emailType={generation.sub_type}
      />
    );
  }

  if (generation.format === "social") {
    // Platform info if needed
    const platformData = generation.platform ? {
      title: generation.platform.charAt(0).toUpperCase(),
      defaultName: generation.platform.charAt(0).toUpperCase() + generation.platform.slice(1),
      charLimit: generation.platform === 'twitter' ? 280 : 2200
    } : null;

    return (
      <SocialPostResultView
        result={latestVersion}
        platform={platformData}
        onBack={handleBack}
        onRegenerate={handleRegenerate}
      />
    );
  }

  // Fallback for other formats
  return (
    <div className="p-8 h-full bg-zinc-950 flex justify-center items-center flex-col">
      <p className="text-zinc-300 font-mono mb-4">Unsupported format: {generation.format}</p>
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-zinc-800 text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
}
