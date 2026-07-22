import React, { useState } from "react";
import apiClient from "../../../Api/api";
import { EmailResultView } from "./EmailResultView";

export function SequenceResultView({ sequence, project, voiceProfile, brandBrief, onBack }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sequenceData, setSequenceData] = useState(sequence);
  const [selectedEmailGeneration, setSelectedEmailGeneration] = useState(null);

  if (!sequenceData) return null;

  const handleGenerateAll = async () => {
    try {
      setIsGenerating(true);
      await apiClient.post(`/api/v1/sequences/${sequenceData.id}/generate`);
      const res = await apiClient.get(`/api/v1/sequences/${sequenceData.id}`);
      setSequenceData(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Error generating sequence emails.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailClick = (position) => {
    if (!sequenceData.generations || sequenceData.generations.length === 0) return;
    
    // Find the generation for this position
    const gen = sequenceData.generations.find(g => g.sequence_position === position);
    if (gen && gen.latest_version) {
      setSelectedEmailGeneration(gen);
    }
  };

  const handleRegenerateIndividual = async () => {
    if (!selectedEmailGeneration) return;
    try {
      const res = await apiClient.post(`/api/v1/sequences/${sequenceData.id}/emails/${selectedEmailGeneration.sequence_position}/regenerate`);
      // It returns GenerationVersionResponse, we need to update our selected email generation
      const updatedGen = { ...selectedEmailGeneration, latest_version: res.data };
      setSelectedEmailGeneration(updatedGen);
      
      // We also update sequenceData to reflect this change
      const updatedGenerations = sequenceData.generations.map(g => 
        g.id === updatedGen.id ? updatedGen : g
      );
      setSequenceData({ ...sequenceData, generations: updatedGenerations });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Error regenerating email.");
    }
  };

  if (selectedEmailGeneration) {
    return (
      <EmailResultView
        result={selectedEmailGeneration.latest_version}
        onBack={() => setSelectedEmailGeneration(null)}
        onRegenerate={handleRegenerateIndividual}
        projectName={project?.name}
        voiceProfileName={voiceProfile?.name || voiceProfile?.profile_name}
        brandBriefName={brandBrief?.name}
        emailType={selectedEmailGeneration.sub_type}
      />
    );
  }

  const emails = sequenceData.sequence_plan?.emails || [];
  const totalEmails = sequenceData.total_emails || emails.length;
  const durationDays = emails.length > 0 ? emails[emails.length - 1].day_offset : 0;
  
  const hasGenerated = sequenceData.status === "complete" || (sequenceData.generations && sequenceData.generations.length > 0);

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-5xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-4">
            {project?.name ? `${project.name} → ` : ""}{sequenceData.sequence_plan?.sequence_name || "Sequence Plan"}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${hasGenerated ? 'border-[#BFFF00]/30 bg-[#BFFF00]/10' : 'border-zinc-800 bg-zinc-900/50'}`}>
              <div className={`w-2 h-2 rounded-full ${hasGenerated ? 'bg-[#BFFF00]' : 'bg-zinc-500'}`}></div>
              <span className={`text-xs font-medium ${hasGenerated ? 'text-[#BFFF00]' : 'text-zinc-300'}`}>
                {sequenceData.status || (hasGenerated ? 'Complete' : 'Planning')}
              </span>
            </div>
            
            {sequenceData.sequence_type && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-500/30 bg-blue-500/10">
                <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span className="text-xs font-medium text-blue-400 capitalize">{sequenceData.sequence_type}</span>
              </div>
            )}
            
            {sequenceData.audience_awareness && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-orange-500/30 bg-orange-500/10">
                <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <span className="text-xs font-medium text-orange-400 capitalize">{sequenceData.audience_awareness}</span>
              </div>
            )}

            {voiceProfile && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50">
                <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                <span className="text-xs font-medium text-zinc-300">{voiceProfile.profile_name || voiceProfile.name}</span>
              </div>
            )}
            
            {brandBrief && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50">
                <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <span className="text-xs font-medium text-zinc-300">{brandBrief.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">

          
          <button className="p-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors bg-zinc-900/50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>

          {!hasGenerated && (
            <button 
              onClick={handleGenerateAll}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-semibold hover:border-zinc-700 transition-colors shadow-lg"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Generate all emails
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-zinc-800/60 mb-8 py-5">
        <div className="px-4 border-r border-zinc-800/60 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">Total Emails</div>
          <div className="text-2xl font-bold text-white mb-0.5">{totalEmails}</div>
          <div className="text-xs text-zinc-500">in this sequence</div>
        </div>
        
        <div className="px-4 border-r border-zinc-800/60 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">Sequence Type</div>
          <div className="text-xl font-bold text-white mb-0.5 capitalize">{sequenceData.sequence_type}</div>
          <div className="text-xs text-zinc-500 capitalize">{sequenceData.audience_awareness} audience</div>
        </div>

        <div className="px-4 border-r border-zinc-800/60 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">Duration</div>
          <div className="text-xl font-bold text-white mb-0.5">{durationDays} days</div>
          <div className="text-xs text-zinc-500">day 0 → day {durationDays}</div>
        </div>

        <div className="px-4 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">Status</div>
          <div className={`text-xl font-bold mb-0.5 capitalize ${hasGenerated ? 'text-[#BFFF00]' : 'text-[#BFFF00]'}`}>{hasGenerated ? 'Complete' : 'Planning'}</div>
          <div className="text-xs text-zinc-500">{hasGenerated ? 'All emails generated' : 'ready to generate'}</div>
        </div>
      </div>

      {/* Emails Timeline */}
      <div className="flex-1 pb-16">
        <div className="space-y-4">
          {emails.map((email, idx) => {
            // Find generation for this position if it exists
            const generation = sequenceData.generations?.find(g => g.sequence_position === email.position);
            
            return (
              <div key={idx} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shrink-0 z-10 
                    ${generation ? 'bg-[#BFFF00]/10 border-[#BFFF00] text-[#BFFF00]' : 'bg-zinc-900 border-[#BFFF00]/50 text-[#BFFF00]'}`}>
                    {email.position}
                  </div>
                  {idx !== emails.length - 1 && (
                    <div className="w-px h-full bg-zinc-800/60 my-1 group-hover:bg-zinc-700 transition-colors"></div>
                  )}
                </div>
                
                <div 
                  onClick={() => hasGenerated ? handleEmailClick(email.position) : null}
                  className={`flex-1 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-all ${hasGenerated ? 'cursor-pointer hover:bg-zinc-900/60 shadow-sm' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">Email Type</div>
                      <h3 className="text-lg font-bold text-white">{email.email_type}</h3>
                    </div>
                    <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium text-zinc-400">
                      Day {email.day_offset}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-400 capitalize">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      {email.strategic_goal}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/40">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mt-0.5 shrink-0">Subject Hint</span>
                    {generation && generation.latest_version ? (
                       <p className="text-sm text-zinc-200">"{generation.latest_version.content.subject_line || generation.latest_version.content.subject}"</p>
                    ) : (
                      <p className="text-sm text-zinc-400">"{email.subject_line_hint}"</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 flex items-center justify-between border-t border-zinc-800/60 pt-6">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#BFFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span className="text-sm text-zinc-400">Critic loop runs on each email before delivery</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          </button>
          <div className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 font-medium">
            {sequenceData.generations?.length || 0} of {totalEmails} emails generated
          </div>
        </div>
      </div>
    </div>
  );
}
