import React from "react";

export function GenerationsLeftCard({ used, limit, left }) {
  // Calculate the ring progress
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = limit > 0 ? (left / limit) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/60 transition-all duration-200 group">
      {/* Label */}
      <p className="text-[10px] font-mono font-semibold tracking-[0.15em] text-zinc-600 uppercase mb-2">
        Generations Left
      </p>

      {/* Value + ring */}
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white tracking-tight leading-none">
          {left}
        </span>
        {/* Circular progress ring */}
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Background ring */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth="3"
          />
          {/* Progress ring */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#BFFF00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 24 24)"
            className="transition-all duration-700 ease-out"
          />
        </svg>
      </div>
    </div>
  );
}
