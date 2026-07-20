import React, { useEffect, useState } from "react";
import apiClient from "../../Api/api";
import { RecentGenerationsList } from "./components/RecentGenerationsList";

export function GenerationsPage({ filter, setBreadcrumbs }) {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  // Title and path based on filter
  let title = "All Generations";
  let path = "/dashboard/generations";
  let description = "View and manage all your generated content across projects.";

  if (filter === "email") {
    title = "Email Copies";
    path = "/dashboard/emails";
    description = "View and manage your generated email copies and sequences.";
  } else if (filter === "social") {
    title = "Social Media Posts";
    path = "/dashboard/social-posts";
    description = "View and manage your generated social media content.";
  }

  useEffect(() => {
    if (setBreadcrumbs) {
      setBreadcrumbs([{ label: title, path }]);
    }
  }, [setBreadcrumbs, title, path]);

  // Reset state when filter changes
  useEffect(() => {
    setGenerations([]);
    setOffset(0);
    setHasMore(true);
    setLoading(true);
    fetchGenerations(0, true);
  }, [filter]);

  async function fetchGenerations(currentOffset, isInitial = false) {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      let url = `/api/v1/generations/?limit=${limit}&offset=${currentOffset}`;
      if (filter) {
        url += `&format=${filter}`;
      }

      const res = await apiClient.get(url);
      const newGens = res.data;

      if (newGens.length < limit) {
        setHasMore(false);
      }

      if (isInitial) {
        setGenerations(newGens);
      } else {
        setGenerations(prev => [...prev, ...newGens]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchGenerations(nextOffset, false);
  };

  if (loading && offset === 0) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-zinc-500 font-mono">Loading {title.toLowerCase()}...</p>
      </div>
    );
  }

  if (error && offset === 0) {
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">{title}</h1>
          <p className="text-sm text-zinc-400 mt-1">{description}</p>
        </div>
      </div>

      <div className="mb-6">
        <RecentGenerationsList
          generations={generations}
          emptyMessage={`No ${title.toLowerCase()} found.`}
        />
      </div>

      {hasMore && generations.length > 0 && (
        <div className="flex justify-center mt-8 pb-10">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "View More"}
          </button>
        </div>
      )}
    </div>
  );
}
