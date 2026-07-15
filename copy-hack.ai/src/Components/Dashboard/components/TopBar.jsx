import React from "react";
import { UserButton } from "@clerk/clerk-react";

export function TopBar() {
  return (
    <header className="h-[60px] min-h-[60px] flex items-center justify-between px-6 md:px-10 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
      {/* Page title */}
      <h2 className="text-white text-base font-semibold tracking-tight">
        Dashboard
      </h2>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Dark mode indicator (dark-only for now) */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 text-xs font-medium hover:border-zinc-700 hover:text-zinc-300 transition-all duration-200 cursor-default"
          title="Dark mode active"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
          Dark Mode
        </button>

        {/* Clerk user button */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 ring-2 ring-zinc-800 hover:ring-[#BFFF00]/40 transition-all duration-200",
            },
          }}
        />
      </div>
    </header>
  );
}
