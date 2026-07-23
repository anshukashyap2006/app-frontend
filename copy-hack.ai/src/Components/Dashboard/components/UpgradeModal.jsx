import React from "react";
import { Link } from "react-router-dom";

export function UpgradeModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Premium Header styling */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 border-b border-zinc-800/50 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 transform rotate-3">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-tight">Generation Limit Reached</h2>
        </div>

        <div className="p-6">
          <p className="text-zinc-400 text-center mb-6 leading-relaxed">
            {message || "You've used up all your generation credits for your current plan. Upgrade to Premium to unlock unlimited AI generations, advanced frameworks, and priority support."}
          </p>

          <div className="flex flex-col gap-3">
            <Link 
              to="/dashboard/settings"
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-100 transition-colors"
            >
              Upgrade to Premium
            </Link>
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-transparent border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
