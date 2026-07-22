import React, { useState } from "react";
import { downloadCopyAsPDF } from "../../../utils/pdfGenerator";

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
      <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1">{subtitle}</span>
    </div>
  );
}

export function EmailResultView({ result, onBack, onRegenerate, projectName, voiceProfileName, brandBriefName, emailType, isRegenerating }) {
  if (!result || !result.content) return null;

  const content = result.content;
  const subject = content.subject_line || content.subject || "No Subject";
  const body = content.body || content.email_body || content.content || "No body content.";
  const versionNumber = result.version_number || 1;

  const critic = result.critic_scores || {};
  const totalScore = critic.total_score || critic.overall || 0;

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 flex flex-col max-w-5xl mx-auto w-full">
      {/* Go Back button (as requested) */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Go Back
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-3">Generate an email</h1>
          <div className="flex flex-wrap items-center gap-2">
            {voiceProfileName && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50">
                <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                <span className="text-xs font-medium text-zinc-300">{voiceProfileName}</span>
              </div>
            )}
            {brandBriefName && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50">
                <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span className="text-xs font-medium text-zinc-300">{brandBriefName}</span>
              </div>
            )}
            {emailType && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#BFFF00]/30 bg-[#BFFF00]/10">
                <svg className="w-3.5 h-3.5 text-[#BFFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                <span className="text-xs font-medium text-[#BFFF00] capitalize">{emailType}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50">
              <span className="text-xs font-medium text-zinc-300">v{versionNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Critic Score Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#BFFF00]/30 bg-[#BFFF00]/10">
            <svg className="w-4 h-4 text-[#BFFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <span className="text-sm font-bold text-[#BFFF00]">{totalScore} / 100</span>
          </div>

          <button 
            onClick={() => {
              downloadCopyAsPDF({
                type: "EMAIL",
                subject: subject,
                body: body,
                filename: `CopyCraft_Email_${emailType || "Generated"}.pdf`
              });
            }}
            className="p-2 rounded-md border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors bg-zinc-900/50"
            title="Download PDF"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>

          <button onClick={handleCopy} className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors ${isCopied ? 'border-[#BFFF00] text-[#BFFF00] bg-[#BFFF00]/10' : 'border-zinc-800 text-white hover:bg-zinc-800 bg-zinc-900/50'}`}>
            {isCopied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copy email
              </>
            )}
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-zinc-800 mb-8 shrink-0"></div>

      {/* Content & Critic Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8 w-full flex-1 overflow-hidden pb-8">
        
        {/* Email Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="mb-8">
            <div className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-widest mb-2">Subject</div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">{subject}</h1>
          </div>
          
          <div className="prose prose-invert prose-zinc max-w-none text-lg">
            {body.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx} className="text-zinc-300 leading-relaxed mb-6">{paragraph}</p> : <br key={idx} />
            ))}
          </div>
          
          {/* Regenerate Button below content */}
          <div className="mt-12 pt-8 border-t border-zinc-800/60">
            <button 
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900/50 text-white text-sm font-semibold hover:border-zinc-500 hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Regenerating Email...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 2v6h6"/></svg>
                  Regenerate Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* Critic Analysis Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0 overflow-y-auto bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-6 flex flex-col gap-8 shadow-xl h-fit max-h-full">
          <div className="flex items-center gap-2 mb-2 border-b border-zinc-800/80 pb-4">
            <svg className="w-5 h-5 text-[#BFFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <h3 className="text-lg font-bold text-white tracking-tight">Critic Analysis</h3>
          </div>
          
          <div className="flex justify-around items-center">
            <CircularScore 
              score={totalScore} 
              label="Overall" 
              subtitle="Score" 
              colorClass="text-[#BFFF00]" 
            />
            <div className="w-px h-16 bg-zinc-800/80"></div>
            <CircularScore 
              score={critic.voice_alignment_score || 0} 
              label="Voice" 
              subtitle="Alignment" 
              colorClass="text-blue-400" 
            />
          </div>

          <div className="flex flex-col gap-6">
            {critic.brand_deviations && critic.brand_deviations.length > 0 && (
              <div>
                <h4 className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500/80"></span>
                  Brand Deviations
                </h4>
                <ul className="space-y-2.5">
                  {critic.brand_deviations.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                      <svg className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {critic.copywriting_problems && critic.copywriting_problems.length > 0 && (
              <div>
                <h4 className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                  Copywriting Issues
                </h4>
                <ul className="space-y-2.5">
                  {critic.copywriting_problems.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                      <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {critic.ai_tells && critic.ai_tells.length > 0 && (
              <div>
                <h4 className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500/80"></span>
                  AI Tells
                </h4>
                <ul className="space-y-2.5">
                  {critic.ai_tells.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2.5 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                      <svg className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(!critic.brand_deviations?.length && !critic.copywriting_problems?.length && !critic.ai_tells?.length) && (
               <div className="flex flex-col items-center justify-center p-6 text-center border border-zinc-800/50 border-dashed rounded-xl bg-zinc-900/20">
                 <svg className="w-8 h-8 text-zinc-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 <p className="text-sm text-zinc-400 font-medium">No major issues found</p>
                 <p className="text-xs text-zinc-500 mt-1">This email looks solid based on the critic analysis.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
