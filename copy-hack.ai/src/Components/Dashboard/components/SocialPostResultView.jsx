import React from "react";

function CircularScore({ score, label, subtitle, colorClass }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 flex items-center justify-center mb-3">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-zinc-800"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${colorClass}`}
          />
        </svg>
        <div className="absolute text-2xl font-bold text-white">{score}</div>
      </div>
      <span className="text-sm font-semibold text-white tracking-tight">{label}</span>
      <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1 text-center">{subtitle}</span>
    </div>
  );
}

export function SocialPostResultView({ result, platform, onBack, onRegenerate }) {
  if (!result || !result.content) return null;

  const content = result.content;
  const body = content.post_body || content.body || content.content || (typeof content === 'string' ? content : "No body content.");
  
  const critic = result.critic_scores || {};
  const totalScore = critic.total_score || critic.overall || 0;
  const voiceScore = critic.voice_alignment_score || critic.brand_voice || 0;
  const platformScore = critic.platform_fit_score || critic.platform_fit || 0;
  
  const brandDeviations = critic.brand_deviations || [];
  const copywritingProblems = critic.copywriting_problems || [];
  const aiTells = critic.ai_tells || [];

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 flex flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:border-zinc-700 hover:text-white transition-all bg-zinc-900/50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Edit form
        </button>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors bg-zinc-900/50">
            Copy Post
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#BFFF00] text-zinc-900 text-sm font-semibold hover:bg-[#d4ff4d] transition-colors">
            Save to Project
          </button>
          <button 
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#BFFF00]/30 text-[#BFFF00] text-sm font-medium hover:bg-[#BFFF00]/10 transition-colors bg-zinc-900/50 ml-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 2v6h6"/></svg>
            Regenerate
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* Left Column - Content */}
        <div className="flex-1 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-8 overflow-y-auto">
          {platform && (
             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800/60">
               <div className="w-10 h-10 rounded bg-[#1a365d]/50 border border-blue-500/30 flex items-center justify-center">
                 <span className="text-xl font-serif text-blue-400 font-bold">{platform.title}</span>
               </div>
               <div>
                 <h2 className="text-white font-semibold">{platform.defaultName} Post</h2>
                 <p className="text-xs text-zinc-500">{body.length} / {platform.charLimit} characters</p>
               </div>
             </div>
          )}
          <div className="prose prose-invert prose-zinc max-w-none">
            {body.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx} className="text-zinc-300 text-[15px] leading-relaxed mb-4">{paragraph}</p> : <br key={idx} />
            ))}
          </div>
        </div>

        {/* Right Column - Critic Report */}
        <div className="w-full lg:w-[400px] flex flex-col shrink-0">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 mb-4">
            <h3 className="text-white font-semibold mb-1 tracking-tight flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Critic Report
            </h3>
            <p className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase mb-8">AI-generated quality analysis against your Voice Profile & Platform</p>
            
            <div className="flex flex-wrap items-center justify-around pb-6 border-b border-zinc-800/60 mb-6 gap-y-6">
              <CircularScore score={totalScore} label="Total Score" subtitle="Overall Quality" colorClass="text-[#BFFF00]" />
              <CircularScore score={voiceScore} label="Voice Match" subtitle="Brand Character" colorClass="text-blue-500" />
              {platformScore > 0 && (
                <CircularScore score={platformScore} label="Platform Fit" subtitle="Format Match" colorClass="text-purple-400" />
              )}
            </div>

            {/* Deviations */}
            {brandDeviations.length > 0 && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.29 3.86-6.46 11.2A2 2 0 0 0 5.56 18h12.88a2 2 0 0 0 1.73-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Brand Deviations
                </h4>
                <ul className="space-y-2">
                  {brandDeviations.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-400 leading-relaxed pl-1">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Copywriting Problems */}
            {copywritingProblems.length > 0 && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-[10px] font-mono text-red-400 tracking-widest uppercase mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Copywriting & Format Problems
                </h4>
                <ul className="space-y-2">
                  {copywritingProblems.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-400 leading-relaxed pl-1">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Tells */}
            {aiTells.length > 0 && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-[10px] font-mono text-purple-400 tracking-widest uppercase mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  AI Tells
                </h4>
                <ul className="space-y-2">
                  {aiTells.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-400 leading-relaxed pl-1">"{item}" — <span className="text-zinc-500">Flagged phrase</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 mt-auto">
            <h4 className="text-white text-sm font-semibold mb-1">Critic-guided regeneration</h4>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4">
              The next generation will apply critic feedback directly — fixing brand deviations, resolving structural problems, and stripping flagged AI tells.
            </p>
            <button 
              onClick={onRegenerate}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#BFFF00] text-zinc-900 text-sm font-semibold hover:bg-[#d4ff4d] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 2v6h6"/></svg>
              Regenerate with Critic Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
