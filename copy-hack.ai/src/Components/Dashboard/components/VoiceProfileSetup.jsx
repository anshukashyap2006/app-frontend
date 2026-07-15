import React from "react";
import { Link } from "react-router-dom";

export function VoiceProfileSetup() {
  return (
    <div className="min-h-full bg-zinc-950 flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full text-center">
        {/* Step indicator */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#BFFF00]/30 bg-[#BFFF00]/5 mb-8">
          <span className="text-[11px] font-mono font-bold tracking-[0.18em] text-[#BFFF00] uppercase">
            Step 1 of 1 — Get Started
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
          Create your Brand Voice
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12">
          Your Voice Profile is the engine behind every piece of copy we
          generate. Set it up once — every generation sounds like you, forever.
        </p>

        {/* Two option cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {/* Option 1: Upload */}
          <div className="relative bg-zinc-900/80 border border-zinc-800/50 rounded-2xl p-7 hover:border-zinc-700/60 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all duration-300 group">
            {/* Recommended badge */}
            <div className="absolute top-5 right-5">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#BFFF00]/15 text-[#BFFF00] text-[10px] font-mono font-bold tracking-wider uppercase">
                Recommended
              </span>
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center mb-5 group-hover:border-[#BFFF00]/30 transition-colors">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400 group-hover:text-[#BFFF00] transition-colors"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-white text-xl font-bold mb-3 tracking-tight">
              Upload your best-performing copy
            </h3>

            {/* Description */}
            <p className="text-zinc-500 text-sm leading-relaxed mb-7">
              Have emails, posts, or sales pages that actually worked? Upload 3–5
              samples and our AI maps your exact tone, vocabulary, sentence
              patterns, and CTA style.
            </p>

            {/* CTA */}
            <Link
              to="/dashboard/voice/create?method=upload"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#BFFF00] text-zinc-900 text-sm font-semibold hover:bg-[#d4ff4d] active:bg-[#a8e600] transition-all duration-200 shadow-[0_0_25px_rgba(191,255,0,0.15)] hover:shadow-[0_0_30px_rgba(191,255,0,0.25)]"
            >
              Upload & Extract Voice
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            {/* Hint */}
            <p className="text-[11px] text-zinc-600 font-mono mt-4">
              Accepts .txt, .pdf, or paste directly
            </p>
          </div>

          {/* Option 2: Questionnaire */}
          <div className="bg-zinc-900/80 border border-zinc-800/50 rounded-2xl p-7 hover:border-zinc-700/60 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all duration-300 group">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center mb-5 mt-6 group-hover:border-zinc-600/60 transition-colors">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400 group-hover:text-zinc-300 transition-colors"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-white text-xl font-bold mb-3 tracking-tight">
              I'll fill out a questionnaire
            </h3>

            {/* Description */}
            <p className="text-zinc-500 text-sm leading-relaxed mb-7">
              No past copy? No problem. Answer 8 guided questions about your
              brand, audience, tone, and style. We build your profile from
              scratch.
            </p>

            {/* CTA */}
            <Link
              to="/dashboard/voice/create?method=questionnaire"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-semibold hover:border-zinc-600 hover:text-white transition-all duration-200"
            >
              Start the Q&A
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            {/* Hint */}
            <p className="text-[11px] text-zinc-600 font-mono mt-4">
              Takes about 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
