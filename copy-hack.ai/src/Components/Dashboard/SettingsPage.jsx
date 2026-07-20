import React, { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import apiClient from "../../Api/api";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openUserProfile } = useClerk();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiClient.get("/api/v1/user/me");
        setUser(res.data);
      } catch (err) {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-zinc-500 font-mono">Loading settings...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-red-400 font-mono">{error || "Could not load user data."}</p>
      </div>
    );
  }

  const { subscription } = user;
  const planName = subscription?.plan_name || "Free";
  const generationsUsed = subscription?.generations_used || 0;
  const generationsLimit = subscription?.generations_limit || 0;
  const initials = user.full_name ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2) : "??";

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-4xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Settings</h1>
        <p className="text-zinc-400 text-sm">Manage your account, subscription, and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-zinc-800/60 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "account"
              ? "bg-zinc-800 text-white border border-zinc-700"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/50 border border-transparent"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("subscription")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "subscription"
              ? "bg-zinc-800 text-white border border-zinc-700"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/50 border border-transparent"
          }`}
        >
          Subscription
        </button>
      </div>

      {/* Content */}
      {activeTab === "account" && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-4 px-1">Your Profile</h2>
          
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden">
            {/* Header Profile Section */}
            <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {initials}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{user.full_name || "User"}</h3>
                  <p className="text-zinc-400 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-xs text-zinc-500 font-medium">Managed by Clerk</span>
              </div>
            </div>

            {/* Name Row */}
            <div className="p-6 border-b border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-12 sm:w-2/3">
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="text-sm text-zinc-400">Full name</span>
                </div>
                <span className="text-white text-sm font-medium truncate">{user.full_name || "—"}</span>
              </div>
              <button 
                onClick={() => openUserProfile()}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition-colors bg-zinc-900 whitespace-nowrap shrink-0"
              >
                Edit via Clerk <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>

            {/* Email Row */}
            <div className="p-6 border-b border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-12 sm:w-2/3">
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span className="text-sm text-zinc-400">Email</span>
                </div>
                <span className="text-white text-sm font-medium truncate">{user.email}</span>
              </div>
              <button 
                onClick={() => openUserProfile()}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition-colors bg-zinc-900 whitespace-nowrap shrink-0"
              >
                Edit via Clerk <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>

            {/* Password Row */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/20">
              <div className="flex items-center gap-12 sm:w-2/3">
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span className="text-sm text-zinc-400">Password</span>
                </div>
                <span className="text-zinc-500 text-sm font-medium">Managed by Clerk</span>
              </div>
              <button 
                onClick={() => openUserProfile()}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition-colors bg-zinc-900 whitespace-nowrap shrink-0"
              >
                Change password <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-4 px-1">Your Plan</h2>
          
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white capitalize">{planName} Plan</h3>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider
                    ${subscription?.status === 'active' ? 'bg-[#BFFF00]/10 text-[#BFFF00] border border-[#BFFF00]/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                    {subscription?.status || 'Free'}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm">
                  {planName.toLowerCase() === 'free' 
                    ? "You are currently on the free plan with limited generations." 
                    : "You have full access to premium features."}
                </p>
              </div>

              {planName.toLowerCase() === 'free' && (
                <button 
                  className="px-6 py-3 rounded-xl bg-[#BFFF00] text-zinc-900 font-bold hover:bg-[#d4ff4d] transition-colors shadow-lg shadow-[#BFFF00]/10 shrink-0"
                >
                  Upgrade Plan
                </button>
              )}
            </div>

            <div className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-6">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <h4 className="text-white font-medium mb-1">Generations Usage</h4>
                  <p className="text-zinc-500 text-sm">Resets at the end of your billing cycle.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">{generationsUsed}</span>
                  <span className="text-zinc-500"> / {generationsLimit}</span>
                </div>
              </div>
              
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#BFFF00] transition-all duration-1000 ease-out rounded-full" 
                  style={{ width: `${Math.min(100, Math.max(0, (generationsUsed / generationsLimit) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
