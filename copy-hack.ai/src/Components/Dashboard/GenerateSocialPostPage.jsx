import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../../Api/api";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { SocialPostResultView } from "./components/SocialPostResultView";

const PLATFORMS = [
  { id: "X", title: "𝕏", subtitle: "X", charLimit: 280, defaultName: "X" },
  { id: "linkedin", title: "in", subtitle: "LinkedIn", charLimit: 3000, defaultName: "LinkedIn" },
  { id: "instagram", title: "IG", subtitle: "Instagram", charLimit: 2200, defaultName: "Instagram" },
  { id: "reddit", title: "R", subtitle: "Reddit", charLimit: 40000, defaultName: "Reddit" },
  { id: "youtube", title: "YT", subtitle: "YT Community", charLimit: 10000, defaultName: "YouTube Community" },
  { id: "facebook", title: "f", subtitle: "Facebook", charLimit: 63206, defaultName: "Facebook" }
];

const POST_TYPES = [
  { id: "value", title: "Value", desc: "Teach, insight, or framework your audience can use today" },
  { id: "promotional", title: "Promotional", desc: "Promote an offer, product, or launch — conversion focused" },
  { id: "story", title: "Story", desc: "Personal narrative or case study that builds trust" },
  { id: "engagement", title: "Engagement", desc: "Spark replies, polls, debates — algorithm-optimised hook" }
];

const AUDIENCE_AWARENESS = [
  { id: "cold", title: "Cold", subtitle: "No idea who you are", desc: "Needs context and credibility before any ask" },
  { id: "warm", title: "Warm", subtitle: "Knows you, not bought", desc: "Familiar — focus on value and gentle nudges" },
  { id: "hot", title: "Hot", subtitle: "Ready to act", desc: "Needs clarity and a direct, confident CTA" }
];

function CheckIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function PostTypeIcon({ type, className }) {
  switch (type) {
    case 'value':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;
    case 'promotional':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
    case 'story':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
    case 'engagement':
      return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
    default:
      return null;
  }
}

export function GenerateSocialPostPage({ dashboardState, setBreadcrumbs }) {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);

  // Form State
  const [platform, setPlatform] = useState("linkedin");
  const [postType, setPostType] = useState("value");
  const [audience, setAudience] = useState("warm");
  const [goal, setGoal] = useState("");
  const [topic, setTopic] = useState("");
  const [toneOverride, setToneOverride] = useState("");
  const [wordCount, setWordCount] = useState("");

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  const [selectedVersionId, setSelectedVersionId] = useState(null);

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
            { label: "Generate Social Post" }
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
      alert("You need a voice profile to generate a post.");
      return;
    }

    // Pick the default voice profile or the first one
    const defaultVoice = dashboardState.voiceProfiles.find(vp => vp.is_default) || dashboardState.voiceProfiles[0];

    try {
      setIsGenerating(true);
      const payload = {
        voice_profile_id: defaultVoice.id,
        brand_brief_id: project.brand_brief.id,
        platform: platform,
        post_type: postType,
        audience_awareness: audience,
        goal: goal,
        post_details: topic,
        tone_override: toneOverride || null,
        word_count_target: wordCount ? parseInt(wordCount) : null
      };

      const res = await apiClient.post(`/api/v1/projects/${projectId}/generate/social`, payload);
      setGenerationResult({ ...res.data, platform: PLATFORMS.find(p => p.id === platform) });
      const latest = res.data.versions && res.data.versions.length > 0 ? res.data.versions[res.data.versions.length - 1] : res.data.latest_version;
      if (latest) {
        setSelectedVersionId(latest.id);
      }

      // Update breadcrumbs for result view
      if (setBreadcrumbs) {
        setBreadcrumbs([
          { label: project.name, href: `/dashboard/projects/${projectId}` },
          { label: "Generate Social Post", href: "#", onClick: () => setGenerationResult(null) },
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
        { label: "Generate Social Post" }
      ]);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate();
  };

  if (loading || isGenerating) return <DashboardSkeleton />;
  if (error) return <div className="text-red-400 p-8">{error}</div>;

  if (generationResult) {
    const versions = generationResult.versions || (generationResult.latest_version ? [generationResult.latest_version] : []);
    const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
    const displayVersion = versions.find(v => v.id === selectedVersionId) || latestVersion || generationResult;

    return (
      <SocialPostResultView
        result={displayVersion}
        platform={generationResult.platform}
        onBack={handleBackToForm}
        onRegenerate={handleRegenerate}
        isRegenerating={isGenerating}
        versions={versions}
        selectedVersionId={displayVersion?.id}
        onSelectVersion={setSelectedVersionId}
      />
    );
  }

  const selectedPlatformData = PLATFORMS.find(p => p.id === platform);

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-4xl">
      {/* Title & Badges */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Generate a Social Post</h1>
        <p className="text-zinc-400 text-sm mb-6">Platform-native copy, written in your voice.</p>
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

      {/* Platform */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-4">Platform</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PLATFORMS.map((p) => (
            <div
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`flex flex-col items-center justify-center py-6 px-4 rounded-xl border cursor-pointer transition-all duration-200 relative ${platform === p.id ? 'bg-[#1a365d]/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}
            >
              {platform === p.id && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#BFFF00] flex items-center justify-center text-zinc-950">
                  <CheckIcon className="w-2.5 h-2.5" />
                </div>
              )}
              <h3 className={`text-3xl font-serif mb-1 ${platform === p.id ? 'text-blue-400 font-bold' : 'text-zinc-400'}`}>{p.title}</h3>
              <p className={`text-xs ${platform === p.id ? 'text-blue-400 font-semibold' : 'text-zinc-500'}`}>{p.subtitle}</p>
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-zinc-500 tracking-wide mt-4">
          Format, character count, and tone will be optimised for <span className="text-blue-400 font-bold">{selectedPlatformData.defaultName}</span> · {selectedPlatformData.charLimit.toLocaleString()} chars limit
        </p>
      </div>

      {/* Post Type */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-4">Post Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POST_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => setPostType(type.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 relative flex flex-col ${postType === type.id ? 'bg-[#BFFF00]/5 border-[#BFFF00] shadow-[0_0_15px_rgba(191,255,0,0.05)]' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}
            >
              {postType === type.id && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#BFFF00] flex items-center justify-center text-zinc-950">
                  <CheckIcon className="w-3 h-3" />
                </div>
              )}
              <div className={`flex items-center gap-2 mb-2 ${postType === type.id ? 'text-[#BFFF00]' : 'text-zinc-300'}`}>
                <PostTypeIcon type={type.id} className="w-4 h-4" />
                <h3 className="font-semibold text-base">{type.title}</h3>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed pr-6">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Awareness */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">Audience Awareness</h2>
        <p className="text-sm text-zinc-500 mb-4">How familiar is this audience with you and your product?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AUDIENCE_AWARENESS.map((aud) => (
            <div
              key={aud.id}
              onClick={() => setAudience(aud.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-center text-center ${audience === aud.id ? 'bg-[#BFFF00]/5 border-[#BFFF00] shadow-[0_0_15px_rgba(191,255,0,0.05)]' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}
            >
              <h3 className={`font-bold text-lg mb-1 ${audience === aud.id ? 'text-white' : 'text-zinc-300'}`}>{aud.title}</h3>
              <p className={`text-xs font-semibold mb-2 ${audience === aud.id ? 'text-white' : 'text-zinc-400'}`}>{aud.subtitle}</p>
              <p className={`text-[11px] leading-relaxed ${audience === aud.id ? 'text-[#BFFF00]' : 'text-zinc-600'}`}>{aud.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">What's the goal of this post?</h2>
        <p className="text-sm text-zinc-500 mb-4">The specific outcome you want — a click, a reply, a share, a conversion.</p>
        <div className="relative">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full h-24 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
            placeholder="e.g. Get warm followers to click through to the Black Friday page — they know the product, this is about timing and urgency."
          />
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">{goal.length} / 300</div>
        </div>
      </div>

      {/* Topic */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">What's this post about?</h2>
        <p className="text-sm text-zinc-500 mb-4">Give the AI everything it needs — the full story, key stats, the offer details, the angle you want to take. More context = sharper copy.</p>
        <div className="relative">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full h-40 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
            placeholder="e.g. We're running a Black Friday deal — $45/month flat, no tiers, no per-generation credits. Goes live Friday midnight, ends Sunday midnight. The core story: most AI tools produce generic output. We built voice profiling and a critic loop that grades every output against your brand voice before you see it..."
          />
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">{topic.length} / 2000</div>
        </div>
      </div>

      {/* Tone override */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">
          Tone override <span className="text-zinc-600 font-normal">(optional)</span>
        </h2>
        <p className="text-sm text-zinc-500 mb-4">A specific angle, phrase, reference, or constraint that isn't captured above.</p>
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
            placeholder="e.g. Open with a counterintuitive take. Don't mention the price in the first 3 lines. Avoid hashtags on LinkedIn."
          />
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">
            {toneOverride.trim() ? toneOverride.trim().split(/\s+/).length : 0} / 200 words
          </div>
        </div>
      </div>

      {/* Word count target */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-white tracking-tight mb-1">
          Word count target <span className="text-zinc-600 font-normal">(optional)</span>
        </h2>
        <p className="text-sm text-zinc-500 mb-4">Leave blank to let the AI pick the optimal length for {selectedPlatformData.defaultName}.</p>
        <div className="flex items-center gap-4">
          <div className="relative w-32">
            <input
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-lg py-2.5 px-4 text-zinc-300 text-sm font-semibold focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
              placeholder="10"
              min="10"
            />
          </div>
          <span className="text-sm text-zinc-500">words (min 10)</span>
          {wordCount && (
            <button
              onClick={() => setWordCount("")}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !goal || !topic}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
            Generate Post →
          </>
        )}
      </button>
      <div className="text-center mt-4 mb-8">
        <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
          Uses ~1 of your {dashboardState?.subscription?.generations_limit || 150} generations · Critic Loop + Platform Fit check runs automatically
        </p>
      </div>
    </div>
  );
}
