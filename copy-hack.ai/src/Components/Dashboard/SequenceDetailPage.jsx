import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../Api/api";
import { EmailResultView } from "./components/EmailResultView";

const GOAL_COLORS = {
  onboard: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", icon: "👋" },
  sell: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "⚡" },
  nurture: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", icon: "💜" },
  "re-engage": { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", icon: "🔄" },
};

const EMAIL_TYPE_BADGES = {
  welcome: { label: "Onboard", bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", icon: "👋" },
  value: { label: "Nurture", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", icon: "💜" },
  objection_handle: { label: "Sell", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "⚡" },
  social_proof: { label: "Nurture", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", icon: "💜" },
  pitch: { label: "Sell", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "🎯" },
  re_engagement: { label: "Re-engage", bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", icon: "🔄" },
  followup: { label: "Nurture", bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", icon: "📧" },
};

export function SequenceDetailPage({ setBreadcrumbs }) {
  const { sequenceId } = useParams();
  const navigate = useNavigate();
  const [sequence, setSequence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmailGeneration, setSelectedEmailGeneration] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    async function fetchSequence() {
      try {
        const res = await apiClient.get(`/api/v1/sequences/${sequenceId}`);
        setSequence(res.data);

        const seqName = res.data.sequence_plan?.sequence_name || "Sequence";
        if (setBreadcrumbs) {
          setBreadcrumbs([
            { label: "All Sequences", path: "/dashboard/sequences" },
            { label: seqName, path: `/dashboard/sequences/${sequenceId}` },
          ]);
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSequence();
  }, [sequenceId, setBreadcrumbs]);

  const handleEmailClick = (position) => {
    if (!sequence.generations || sequence.generations.length === 0) return;
    const gen = sequence.generations.find(g => g.sequence_position === position);
    if (gen && gen.latest_version) {
      setSelectedEmailGeneration(gen);
    }
  };

  const handleRegenerateIndividual = async () => {
    if (!selectedEmailGeneration) return;
    setIsRegenerating(true);
    try {
      const res = await apiClient.post(`/api/v1/sequences/${sequence.id}/emails/${selectedEmailGeneration.sequence_position}/regenerate`);
      const updatedGen = { ...selectedEmailGeneration, latest_version: res.data };
      setSelectedEmailGeneration(updatedGen);
      const updatedGenerations = sequence.generations.map(g =>
        g.id === updatedGen.id ? updatedGen : g
      );
      setSequence({ ...sequence, generations: updatedGenerations });
    } catch (err) {
      alert(err.response?.data?.detail || "Error regenerating email.");
    } finally {
      setIsRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-zinc-500 font-mono">Loading sequence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 h-full bg-zinc-950 flex justify-center items-center">
        <p className="text-red-400 font-mono">Error: {error}</p>
      </div>
    );
  }

  if (!sequence) return null;

  // If viewing a single email
  if (selectedEmailGeneration) {
    return (
      <EmailResultView
        result={selectedEmailGeneration.latest_version}
        onBack={() => setSelectedEmailGeneration(null)}
        onRegenerate={handleRegenerateIndividual}
        emailType={selectedEmailGeneration.sub_type}
      />
    );
  }

  const emails = sequence.sequence_plan?.emails || [];
  const totalEmails = sequence.total_emails || emails.length;
  const durationDays = emails.length > 0 ? emails[emails.length - 1].day_offset : 0;
  const hasGenerated = sequence.status === "complete" || (sequence.generations && sequence.generations.length > 0);
  const seqName = sequence.sequence_plan?.sequence_name || "Email Sequence";

  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-5xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-4">{seqName}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${hasGenerated ? 'border-[#BFFF00]/30 bg-[#BFFF00]/10' : 'border-zinc-800 bg-zinc-900/50'}`}>
              <div className={`w-2 h-2 rounded-full ${hasGenerated ? 'bg-[#BFFF00]' : 'bg-zinc-500'}`}></div>
              <span className={`text-xs font-medium ${hasGenerated ? 'text-[#BFFF00]' : 'text-zinc-300'}`}>
                {sequence.status || (hasGenerated ? 'Complete' : 'Planning')}
              </span>
            </div>

            {sequence.sequence_type && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-500/30 bg-blue-500/10">
                <span className="text-xs font-medium text-blue-400 capitalize">{sequence.sequence_type}</span>
              </div>
            )}

            {sequence.audience_awareness && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-orange-500/30 bg-orange-500/10">
                <span className="text-xs font-medium text-orange-400 capitalize">{sequence.audience_awareness}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/sequences")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors bg-zinc-900/50 text-sm font-medium shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Sequences
        </button>
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
          <div className="text-xl font-bold text-white mb-0.5 capitalize">{sequence.sequence_type}</div>
          <div className="text-xs text-zinc-500 capitalize">{sequence.audience_awareness} audience</div>
        </div>

        <div className="px-4 border-r border-zinc-800/60 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">Duration</div>
          <div className="text-xl font-bold text-white mb-0.5">{durationDays} days</div>
          <div className="text-xs text-zinc-500">day 0 → day {durationDays}</div>
        </div>

        <div className="px-4 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">Status</div>
          <div className={`text-xl font-bold mb-0.5 capitalize ${hasGenerated ? 'text-[#BFFF00]' : 'text-zinc-400'}`}>
            {hasGenerated ? 'Complete' : 'Planning'}
          </div>
          <div className="text-xs text-zinc-500">{hasGenerated ? 'All emails generated' : 'ready to generate'}</div>
        </div>
      </div>

      {/* Emails Timeline */}
      <div className="flex-1 pb-16">
        <div className="space-y-4">
          {emails.map((email, idx) => {
            const generation = sequence.generations?.find(g => g.sequence_position === email.position);
            const badge = EMAIL_TYPE_BADGES[email.email_type] || { label: email.email_type, bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", icon: "📧" };

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
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${badge.border} ${badge.bg} text-xs font-medium ${badge.text} capitalize`}>
                      {badge.icon} {badge.label}
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

      {/* Bottom bar */}
      <div className="mt-8 flex items-center justify-between border-t border-zinc-800/60 pt-6">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#BFFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span className="text-sm text-zinc-400">Click any email card to view its full content</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 font-medium">
          {sequence.generations?.length || 0} of {totalEmails} emails generated
        </div>
      </div>
    </div>
  );
}
