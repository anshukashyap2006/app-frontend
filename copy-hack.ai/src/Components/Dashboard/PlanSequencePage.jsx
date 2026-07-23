import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiClient from "../../Api/api";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { SequenceResultView } from "./components/SequenceResultView";
import { UpgradeModal } from "./components/UpgradeModal";

const SEQUENCE_TYPES = [
  { id: "welcome", title: "Welcome", desc: "Onboard new subscribers — build trust, set expectations, deliver first value fast", icon: "mail" },
  { id: "sales", title: "Sales", desc: "Drive conversions — progressive value build culminating in a confident, direct pitch", icon: "zap" },
  { id: "broadcast", title: "Broadcast", desc: "Campaign or announcement series — single narrative arc spread across timed sends", icon: "send" }
];

const SEQUENCE_GOALS = [
  { id: "onboard", title: "Onboard", desc: "Get new users to their first meaningful win", icon: "users" },
  { id: "sell", title: "Sell", desc: "Move prospects from interested to paying", icon: "zap" },
  { id: "nurture", title: "Nurture", desc: "Build relationship + authority over time", icon: "heart" },
  { id: "re-engage", title: "Re-engage", desc: "Win back cold or inactive subscribers", icon: "refresh-cw" }
];

const AUDIENCE_AWARENESS = [
  { id: "cold", title: "Cold", subtitle: "No idea who you are", desc: "Needs context and credibility before any ask" },
  { id: "warm", title: "Warm", subtitle: "Knows you, not bought", desc: "Familiar — focus on value and gentle nudges" },
  { id: "hot", title: "Hot", subtitle: "Ready to act", desc: "Needs clarity and a confident, direct CTA" }
];

function CheckIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function DynamicIcon({ name, className }) {
  switch (name) {
    case 'mail':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
    case 'zap':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
    case 'send':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
    case 'users':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
    case 'heart':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
    case 'refresh-cw':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
    default:
      return null;
  }
}

export function PlanSequencePage({ dashboardState, setBreadcrumbs }) {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);

  // Form State
  const [sequenceType, setSequenceType] = useState("welcome");
  const [sequenceGoal, setSequenceGoal] = useState("onboard");
  const [audience, setAudience] = useState("warm");
  const [numEmails, setNumEmails] = useState(5);
  const [toneOverride, setToneOverride] = useState("");

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!projectId) {
        setError("No project ID provided.");
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get(`/api/v1/projects/${projectId}`);
        setProject(res.data);
        if (setBreadcrumbs) {
          setBreadcrumbs([
            { label: "Projects", href: "/dashboard" },
            { label: res.data.name, href: `/dashboard/projects/${projectId}` },
            { label: "Plan Email Sequence" }
          ]);
        }
      } catch (err) {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId, setBreadcrumbs]);

  const handleGenerate = async () => {
    if (!dashboardState?.voiceProfiles?.length) {
      alert("You need a voice profile to generate a sequence plan.");
      return;
    }
    
    if (!project?.brand_brief) {
      alert("Please link a brand brief to this project first.");
      return;
    }

    const defaultVoice = dashboardState.voiceProfiles.find(vp => vp.is_default) || dashboardState.voiceProfiles[0];

    try {
      setIsGenerating(true);
      const payload = {
        voice_profile_id: defaultVoice.id,
        brand_brief_id: project.brand_brief.id,
        sequence_type: sequenceType,
        sequence_goal: sequenceGoal,
        audience_awareness: audience,
        total_emails: numEmails,
        tone_override: toneOverride || null
      };

      const res = await apiClient.post(`/api/v1/projects/${projectId}/sequences/plan`, payload);
      setPlanResult(res.data);

      // Update breadcrumbs for result view
      if (setBreadcrumbs) {
        setBreadcrumbs([
          { label: project.name, href: `/dashboard/projects/${projectId}` },
          { label: "Plan Email Sequence", href: "#", onClick: () => setPlanResult(null) },
          { label: "Plan Result" }
        ]);
      }

    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setShowUpgradeModal(true);
      } else {
        alert(err.response?.data?.detail || "An error occurred during sequence planning.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToForm = () => {
    setPlanResult(null);
    if (setBreadcrumbs && project) {
      setBreadcrumbs([
        { label: "Projects", href: "/dashboard" },
        { label: project.name, href: `/dashboard/projects/${projectId}` },
        { label: "Plan Email Sequence" }
      ]);
    }
  };

  const handleNumEmailsChange = (increment) => {
    setNumEmails((prev) => {
      const newVal = prev + increment;
      if (newVal < 3) return 3;
      if (newVal > 7) return 7;
      return newVal;
    });
  };

  if (loading || isGenerating) return <DashboardSkeleton />;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  if (planResult) {
    const defaultVoice = dashboardState?.voiceProfiles?.find(vp => vp.is_default) || dashboardState?.voiceProfiles?.[0];
    return (
      <>
        <SequenceResultView 
          sequence={planResult}
          project={project}
          voiceProfile={defaultVoice}
          brandBrief={project?.brand_brief}
          onBack={handleBackToForm}
        />
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      </>
    );
  }

  const hasVoiceProfiles = dashboardState?.voiceProfiles?.length > 0;

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-4xl relative">
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      
      {!hasVoiceProfiles && (
        <div className="absolute inset-0 z-10 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-xl">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-[#BFFF00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#BFFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Voice Profile Required</h3>
            <p className="text-zinc-400 mb-6">You need to set up at least one Voice Profile before you can generate copy that sounds like you.</p>
            <Link to="/dashboard/voice" className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#BFFF00] text-zinc-950 font-bold rounded-xl hover:bg-[#a6e600] transition-colors">
              Create Voice Profile
            </Link>
          </div>
        </div>
      )}

      {/* Title & Badges */}
      <div className={`mb-10 ${!hasVoiceProfiles ? 'opacity-30 pointer-events-none' : ''}`}>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Plan an Email Sequence</h1>
        <p className="text-zinc-400 text-sm mb-6 max-w-2xl">Define the structure and your AI will map out every email's role, subject line, and beats — then you generate each one individually.</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
            <span className="text-[#BFFF00]"><CheckIcon className="w-3.5 h-3.5" /></span>
            <span className="text-xs font-medium text-[#BFFF00]">Brand Voice — SaaS</span>
          </div>
          {project.brand_brief && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10">
              <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span className="text-xs font-medium text-blue-400">{project.brand_brief.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sequence Type */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">Sequence type</h2>
        <p className="text-sm text-zinc-500 mb-4">Determines the arc structure, timing cadence, and tone progression across the sequence.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SEQUENCE_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => setSequenceType(type.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 relative flex flex-col ${sequenceType === type.id ? 'bg-[#1a365d]/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}
            >
              {sequenceType === type.id && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#BFFF00] flex items-center justify-center text-zinc-950">
                  <CheckIcon className="w-3 h-3" />
                </div>
              )}
              <div className={`flex items-center gap-2 mb-2 ${sequenceType === type.id ? 'text-blue-400' : 'text-zinc-300'}`}>
                <DynamicIcon name={type.icon} className="w-5 h-5" />
              </div>
              <h3 className={`font-semibold text-base mb-2 ${sequenceType === type.id ? 'text-blue-400' : 'text-white'}`}>{type.title}</h3>
              <p className={`text-[13px] leading-relaxed ${sequenceType === type.id ? 'text-blue-400/80' : 'text-zinc-500'}`}>{type.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sequence Goal */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">Sequence goal</h2>
        <p className="text-sm text-zinc-500 mb-4">The primary outcome this sequence should produce by the final email.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SEQUENCE_GOALS.map((goal) => (
            <div
              key={goal.id}
              onClick={() => setSequenceGoal(goal.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 relative flex flex-col ${sequenceGoal === goal.id ? 'bg-[#BFFF00]/5 border-[#BFFF00] shadow-[0_0_15px_rgba(191,255,0,0.05)]' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}
            >
              {sequenceGoal === goal.id && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#BFFF00] flex items-center justify-center text-zinc-950">
                  <CheckIcon className="w-3 h-3" />
                </div>
              )}
              <div className={`flex items-center gap-2 mb-1 ${sequenceGoal === goal.id ? 'text-[#BFFF00]' : 'text-zinc-300'}`}>
                <DynamicIcon name={goal.icon} className="w-4 h-4" />
                <h3 className="font-semibold text-base">{goal.title}</h3>
              </div>
              <p className={`text-sm leading-relaxed pl-6 ${sequenceGoal === goal.id ? 'text-[#BFFF00]/80' : 'text-zinc-500'}`}>{goal.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Awareness */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">Audience awareness</h2>
        <p className="text-sm text-zinc-500 mb-4">How familiar is this audience with you and what you're offering?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AUDIENCE_AWARENESS.map((aud) => (
            <div
              key={aud.id}
              onClick={() => setAudience(aud.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-center text-center relative ${audience === aud.id ? 'bg-[#BFFF00]/5 border-[#BFFF00] shadow-[0_0_15px_rgba(191,255,0,0.05)]' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}
            >
              {audience === aud.id && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#BFFF00] flex items-center justify-center text-zinc-950">
                  <CheckIcon className="w-2.5 h-2.5" />
                </div>
              )}
              <h3 className={`font-bold text-lg mb-1 ${audience === aud.id ? 'text-white' : 'text-zinc-300'}`}>{aud.title}</h3>
              <p className={`text-xs font-semibold mb-2 ${audience === aud.id ? 'text-white' : 'text-zinc-400'}`}>{aud.subtitle}</p>
              <p className={`text-[11px] leading-relaxed ${audience === aud.id ? 'text-[#BFFF00]' : 'text-zinc-600'}`}>{aud.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Number of emails */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">Number of emails</h2>
        <p className="text-sm text-zinc-500 mb-4">Between 3 and 7. Each will get its own role, subject line, and beat sheet.</p>
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNumEmailsChange(-1)}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#BFFF00]/5 border-2 border-[#BFFF00] text-3xl font-bold text-[#BFFF00] shadow-[0_0_15px_rgba(191,255,0,0.1)]">
              {numEmails}
            </div>
            <button
              onClick={() => handleNumEmailsChange(1)}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
          <div className="flex-1 flex items-center gap-1.5 max-w-sm">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i < numEmails ? 'bg-[#BFFF00]' : 'bg-zinc-800'}`}
              ></div>
            ))}
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest ml-2">max 7</span>
          </div>
        </div>
        <p className="text-[12px] font-mono text-zinc-500 tracking-wide">
          Recommended — room for a story beat and objection handling without fatigue.
        </p>
      </div>

      {/* Tone override */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">
          Tone override <span className="text-zinc-600 font-normal">(optional)</span>
        </h2>
        <p className="text-sm text-zinc-500 mb-4">A specific instruction for the whole sequence — a constraint, angle, or personality note that applies across all emails.</p>
        <div className="relative">
          <textarea
            value={toneOverride}
            onChange={(e) => {
              const val = e.target.value;
              const wordCount = val.trim() ? val.trim().split(/\s+/).length : 0;
              if (wordCount <= 200 || val.length < toneOverride.length) {
                setToneOverride(val);
              }
            }}
            className="w-full h-24 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
            placeholder="e.g. The whole sequence should feel like emails from a fellow founder, not a SaaS company. No 'we' language — always 'I'. No CTA until Email 4."
          />
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">
            {toneOverride.trim() ? toneOverride.trim().split(/\s+/).length : 0} / 200 words
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#BFFF00] text-zinc-950 text-base font-bold tracking-tight hover:bg-[#d4ff4d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(191,255,0,0.15)] hover:shadow-[0_0_30px_rgba(191,255,0,0.25)]"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-7 5-7-5Z"></path><path d="m21 8-7 5-7-5Z"></path><path d="M7 12V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8"></path></svg>
            Generate Sequence Plan →
          </>
        )}
      </button>
      <div className="text-center mt-4 mb-8">
        <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
          Maps all {numEmails} emails · Uses ~1 generation · Critic Loop evaluates arc + voice consistency
        </p>
      </div>
    </div>
  );
}
