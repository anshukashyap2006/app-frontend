import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../../Api/api";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { EmailResultView } from "./components/EmailResultView";

const EMAIL_TYPES = [
  { id: "cold_outreach", title: "Cold Outreach", desc: "Pattern-interrupt opener, credibility build, low-friction ask", icon: "user-plus" },
  { id: "nurture", title: "Nurture", desc: "Value-first, relationship-driven — warms without pushing", icon: "heart" },
  { id: "re_engagement", title: "Re-engagement", desc: "Bold re-opener that gives dormant readers a reason to care again", icon: "refresh" },
  { id: "launch", title: "Launch", desc: "High-energy announcement with urgency hooks and momentum", icon: "rocket" },
  { id: "pitch", title: "Pitch", desc: "Clear offer, objection handling, and a direct 'buy now' close", icon: "dollar" },
  { id: "custom", title: "Custom", desc: "Describe your own email type in your own words", icon: "edit" }
];

const FRAMEWORKS = [
  { id: "none", title: "Auto", desc: "AI picks the best fit" },
  { id: "AIDA", title: "AIDA", desc: "Attention → Interest → Desire → Action" },
  { id: "PAS", title: "PAS", desc: "Problem → Agitate → Solution" },
  { id: "HVA", title: "HVA", desc: "Lead with the high-value outcome" }
];

const LENGTHS = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" }
];

const QUICK_FILL_GOALS = [
  "Get warm subscribers to click through to the Black Friday sale page — urgency, not explanation.",
  "Drive signups to the new feature waitlist before we go public.",
  "Announce the course is open and get the fence-sitters to finally commit."
];

function CheckIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export function GenerateEmailPage({ dashboardState, setBreadcrumbs }) {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);

  // Form State
  const [emailType, setEmailType] = useState("launch");
  const [customEmailType, setCustomEmailType] = useState("");
  const [goal, setGoal] = useState("");
  const [cta, setCta] = useState("");
  const [framework, setFramework] = useState("none");
  const [length, setLength] = useState("medium");
  const [extra, setExtra] = useState("");

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);

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
            { label: "Generate Email" }
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
      alert("You need a voice profile to generate an email.");
      return;
    }

    // Pick the default voice profile or the first one
    const defaultVoice = dashboardState.voiceProfiles.find(vp => vp.is_default) || dashboardState.voiceProfiles[0];

    try {
      setIsGenerating(true);
      const payload = {
        voice_profile_id: defaultVoice.id,
        brand_brief_id: project.brand_brief.id,
        email_type: emailType === "custom" ? `Custom: ${customEmailType}` : emailType,
        goal: goal,
        cta: cta || "Click here", // Ensure CTA has fallback if empty
        framework: framework === "none" ? null : framework,
        length: length,
        tone_override: extra || null
      };

      const res = await apiClient.post(`/api/v1/projects/${projectId}/generate/email`, payload);
      setGenerationResult(res.data);

      // Update breadcrumbs for result view
      if (setBreadcrumbs) {
        setBreadcrumbs([
          { label: project.name, href: `/dashboard/projects/${projectId}` },
          { label: "Generate Email", href: "#", onClick: () => setGenerationResult(null) },
          { label: "Result" }
        ]);
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToForm = () => {
    setGenerationResult(null);
    if (setBreadcrumbs && project) {
      setBreadcrumbs([
        { label: "Projects", href: "/dashboard" },
        { label: project.name, href: `/dashboard/projects/${projectId}` },
        { label: "Generate Email" }
      ]);
    }
  };

  const handleRegenerate = async () => {
    // If it's a regenerate flow, backend route is for sequences.
    // For individual emails, we just generate again or use the same payload
    await handleGenerate();
  };

  if (loading || isGenerating) return <DashboardSkeleton />;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  if (generationResult) {
    const defaultVoice = dashboardState?.voiceProfiles?.find(vp => vp.is_default) || dashboardState?.voiceProfiles?.[0];
    return (
      <EmailResultView
        result={generationResult.latest_version || generationResult}
        onBack={handleBackToForm}
        onRegenerate={handleRegenerate}
        projectName={project?.name}
        voiceProfileName={defaultVoice?.name}
        brandBriefName={project?.brand_brief?.name}
        emailType={emailType}
      />
    );
  }

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-4xl">
      {/* Title & Badges */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Generate an Email</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
            <span className="text-[#BFFF00]"><CheckIcon className="w-3.5 h-3.5" /></span>
            <span className="text-xs font-medium text-[#BFFF00]">Brand Voice — SaaS</span>
          </div>
          {project.brand_brief && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-xs font-medium text-blue-400">{project.brand_brief.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Steps (Visual only) */}
      <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-8 py-5 mb-10">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-6 h-6 rounded-full bg-[#BFFF00] flex items-center justify-center text-zinc-950 shrink-0">
            <CheckIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[#BFFF00] text-xs font-semibold uppercase tracking-widest">Type</span>
        </div>
        <div className="flex-1 h-px bg-zinc-800"></div>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <div className="w-6 h-6 rounded-full border border-zinc-700 text-zinc-500 flex items-center justify-center text-xs font-medium shrink-0">2</div>
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Goal & CTA</span>
        </div>
        <div className="flex-1 h-px bg-zinc-800"></div>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <div className="w-6 h-6 rounded-full bg-[#BFFF00] flex items-center justify-center text-zinc-950 shrink-0">
            <CheckIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[#BFFF00] text-xs font-semibold uppercase tracking-widest">Settings</span>
        </div>
        <div className="flex-1 h-px bg-zinc-800"></div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="w-6 h-6 rounded-full border border-zinc-700 text-zinc-500 flex items-center justify-center text-xs font-medium shrink-0">4</div>
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Generate</span>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-4">What kind of email is this?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMAIL_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => setEmailType(type.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 relative ${emailType === type.id ? 'bg-[#BFFF00]/5 border-[#BFFF00] shadow-[0_0_15px_rgba(191,255,0,0.05)]' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}
            >
              {emailType === type.id && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#BFFF00] flex items-center justify-center text-zinc-950">
                  <CheckIcon className="w-3 h-3" />
                </div>
              )}
              <h3 className={`font-semibold mb-2 ${emailType === type.id ? 'text-[#BFFF00]' : 'text-white'}`}>{type.title}</h3>
              
              {type.id === "custom" && emailType === "custom" ? (
                <div className="mt-3 relative" onClick={e => e.stopPropagation()}>
                  <textarea
                    autoFocus
                    value={customEmailType}
                    onChange={(e) => {
                      const words = e.target.value.split(/\s+/).filter(Boolean);
                      if (words.length <= 100) {
                        setCustomEmailType(e.target.value);
                      }
                    }}
                    placeholder="e.g. Apology email for server downtime, or a highly technical changelog update..."
                    className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300 text-xs focus:outline-none focus:border-[#BFFF00]/50 transition-colors resize-none"
                  />
                  <div className="absolute bottom-2 right-2 text-[9px] font-mono text-zinc-500">
                    {customEmailType.split(/\s+/).filter(Boolean).length}/100 words
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 leading-relaxed pr-6">{type.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">What's the goal of this email?</h2>
        <p className="text-sm text-zinc-500 mb-4">Be specific — vague goals produce vague copy.</p>

        <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-3">Quick Fill →</p>
        <div className="space-y-3">
          {QUICK_FILL_GOALS.map((qf, idx) => (
            <div
              key={idx}
              onClick={() => setGoal(qf)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-colors text-sm ${goal === qf ? 'bg-[#BFFF00]/5 border-[#BFFF00] text-[#BFFF00]' : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'}`}
            >
              <div className="flex items-start gap-3">
                {goal === qf ? <CheckIcon className="w-4 h-4 mt-0.5 shrink-0" /> : <div className="w-4 h-4 shrink-0" />}
                <p>{qf}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 relative">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full h-32 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
            placeholder="Describe your goal..."
          />
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">{goal.length} / 150</div>
        </div>
      </div>

      {/* CTA */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">What action should the reader take?</h2>
        <p className="text-sm text-zinc-500 mb-4">The single most important click or response.</p>
        <div className="relative">
          <textarea
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full h-24 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
            placeholder="e.g. &quot;Click to see the offer →&quot; / &quot;Reply YES&quot; / &quot;Book a 20-min call&quot;"
          />
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">{cta.length}/200</div>
        </div>
      </div>

      {/* Framework */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">Copywriting Framework</h2>
        <p className="text-sm text-zinc-500 mb-4">Leave on Auto to let the AI pick the best fit.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FRAMEWORKS.map((fw) => (
            <div
              key={fw.id}
              onClick={() => setFramework(fw.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${framework === fw.id ? 'bg-[#BFFF00]/5 border-[#BFFF00] shadow-[0_0_15px_rgba(191,255,0,0.05)]' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}
            >
              <h3 className={`font-semibold mb-1 ${framework === fw.id ? 'text-[#BFFF00]' : 'text-white'}`}>{fw.title}</h3>
              <p className={`text-[10px] font-mono tracking-widest uppercase ${framework === fw.id ? 'text-[#BFFF00]/80' : 'text-zinc-600'}`}>{fw.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Length */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-4">Email Length</h2>
        <div className="inline-flex bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-1 w-full md:w-auto">
          {LENGTHS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLength(l.id)}
              className={`flex-1 md:w-32 py-2.5 rounded-md text-sm font-semibold transition-colors ${length === l.id ? 'bg-[#BFFF00] text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] font-mono text-zinc-600 tracking-widest mt-3">
          ~300 words — readable, with one story beat
        </p>
      </div>

      {/* Anything Extra */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">
          Anything extra? <span className="text-zinc-600 font-normal">(optional)</span>
        </h2>
        <p className="text-sm text-zinc-500 mb-4">A specific angle, stat, or creative constraint unique to this email.</p>
        <div className="relative">
          <textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            className="w-full h-28 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
            placeholder="e.g. Open with the stat that 73% of AI emails are spotted in under 3 seconds. Founder tone, not marketing blast."
          />
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">{extra.length}/200</div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !goal}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
            Generate Email →
          </>
        )}
      </button>
      <div className="text-center mt-4 mb-8">
        <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
          Uses ~1 of your {dashboardState?.subscription?.generations_limit || 150} generations · Critic Loop runs automatically
        </p>
      </div>
    </div>
  );
}
