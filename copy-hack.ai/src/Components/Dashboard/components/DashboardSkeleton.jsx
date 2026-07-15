import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 animate-pulse">
      {/* Greeting skeleton */}
      <div className="h-7 w-64 bg-zinc-800/60 rounded-md mb-8" />

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-5 h-[100px]"
          >
            <div className="h-3 w-24 bg-zinc-800/60 rounded mb-4 skeleton-shimmer" />
            <div className="h-8 w-14 bg-zinc-800/60 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="h-3 w-48 bg-zinc-800/60 rounded mb-4 skeleton-shimmer" />

      {/* Quick action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-6 h-[180px]"
          >
            <div className="h-10 w-10 bg-zinc-800/60 rounded-lg mb-4 skeleton-shimmer" />
            <div className="h-5 w-36 bg-zinc-800/60 rounded mb-3 skeleton-shimmer" />
            <div className="h-3 w-full bg-zinc-800/60 rounded mb-2 skeleton-shimmer" />
            <div className="h-3 w-2/3 bg-zinc-800/60 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Recent content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i}>
            <div className="h-3 w-32 bg-zinc-800/60 rounded mb-4 skeleton-shimmer" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="h-9 w-9 bg-zinc-800/60 rounded-lg flex-shrink-0 skeleton-shimmer" />
                  <div className="flex-1">
                    <div className="h-4 w-40 bg-zinc-800/60 rounded mb-2 skeleton-shimmer" />
                    <div className="h-3 w-24 bg-zinc-800/60 rounded skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
