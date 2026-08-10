import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export function TopBar({ breadcrumbs, setSidebarOpen }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("app-theme") || "dark";
    if (theme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light-theme");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false);
      document.documentElement.classList.add("light-theme");
      localStorage.setItem("app-theme", "light");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light-theme");
      localStorage.setItem("app-theme", "dark");
    }
  };

  return (
    <header className="h-[56px] lg:h-[60px] min-h-[56px] lg:min-h-[60px] flex items-center justify-between px-4 md:px-6 lg:px-10 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
      {/* Left side: hamburger + breadcrumbs */}
      <div className="flex items-center gap-3 text-base font-semibold tracking-tight min-w-0">
        {/* Hamburger menu — visible only below lg */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-1.5 -ml-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Page title / Breadcrumbs */}
        {breadcrumbs ? (
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-zinc-600 shrink-0">/</span>}
                {crumb.href ? (
                  <Link to={crumb.href} className="text-zinc-500 hover:text-zinc-300 transition-colors truncate hidden sm:inline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white truncate">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <h2 className="text-white">Dashboard</h2>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
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
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
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
