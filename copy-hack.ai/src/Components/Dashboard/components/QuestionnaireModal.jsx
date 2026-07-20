import React, { useState } from "react";
import apiClient from "../../../Api/api";

const STEPS = [
  { id: 1, title: "TONE & PERSONALITY" },
  { id: 2, title: "FORMALITY" },
  { id: 3, title: "SENTENCE STYLE" },
  { id: 4, title: "POWER WORDS" },
  { id: 5, title: "WORDS TO AVOID" },
  { id: 6, title: "CALLS TO ACTION" },
  { id: 7, title: "FORMATS & EMOTIONAL TEMPERATURE" },
  { id: 8, title: "EXAMPLES & PROHIBITIONS" },
];

const TONE_OPTIONS = [
  "Bold", "Direct", "Witty", "Authoritative", "Warm", "Conversational",
  "Playful", "Edgy", "Professional", "Empathetic", "Urgent", "Inspiring"
];

const FORMALITY_OPTIONS = [
  "Very casual (like texting a friend)",
  "Casual (approachable, relaxed)",
  "Balanced (professional but human)",
  "Formal (polished, boardroom-ready)",
  "Very formal (academic/legal)"
];

const SENTENCE_STYLE_OPTIONS = [
  "Short punchy fragments",
  "Mix of short and medium",
  "Long flowing sentences",
  "Varies by section",
  "Question-driven"
];

const QUICK_POWER_WORDS = [
  "proven", "effortless", "guaranteed", "built for", "without the...", "finally", "imagine"
];

const QUICK_AVOIDED_WORDS = [
  "synergy", "disrupting", "game-changing", "unlock", "leverage", "seamless", "empower"
];

const CTA_OPTIONS = [
  "Urgent (Last chance, Now)",
  "Benefit-led (Get X, Start Y)",
  "Soft (See how it works)",
  "Command (Buy. Enroll. Start.)",
  "Question (Ready to X?)",
  "Low-pressure (No commitment)"
];

const FORMAT_OPTIONS = [
  "Email sequences", "Long-form sales pages", "Short social posts", "LinkedIn articles",
  "Landing pages", "Ad copy", "SMS", "Video scripts", "Case studies", "Newsletters"
];

const EMOTIONAL_TEMP_OPTIONS = [
  "Calm & logical", "Motivating & warm", "Excited & energetic",
  "Tense & urgent", "Inspiring & visionary", "Witty & light"
];

export function QuestionnaireModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState({
    tone: [],
    toneOther: "",
    formality: "",
    sentenceStyle: "",
    powerWords: [],
    avoidedPhrases: [],
    ctaStyle: "",
    formatsUsed: [],
    emotionalTemperature: "",
    goldenSentence: "",
    hardRule: ""
  });

  const [powerWordInput, setPowerWordInput] = useState("");
  const [avoidedWordInput, setAvoidedWordInput] = useState("");

  if (!isOpen) return null;

  const handleNext = () => setStep((s) => Math.min(s + 1, 8));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const toggleArrayItem = (field, item) => {
    setAnswers((prev) => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter((x) => x !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  const setField = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPowerWord = (e) => {
    e?.preventDefault();
    if (powerWordInput.trim() && !answers.powerWords.includes(powerWordInput.trim())) {
      setAnswers(prev => ({ ...prev, powerWords: [...prev.powerWords, powerWordInput.trim()] }));
    }
    setPowerWordInput("");
  };

  const handleAddAvoidedWord = (e) => {
    e?.preventDefault();
    if (avoidedWordInput.trim() && !answers.avoidedPhrases.includes(avoidedWordInput.trim())) {
      setAnswers(prev => ({ ...prev, avoidedPhrases: [...prev.avoidedPhrases, avoidedWordInput.trim()] }));
    }
    setAvoidedWordInput("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build a simplified payload for the AI
      const payload = {
        tone: [...answers.tone, answers.toneOther].filter(Boolean).join(", "),
        formality: answers.formality,
        sentence_style: answers.sentenceStyle,
        power_words: answers.powerWords.join(", "),
        avoided_phrases: answers.avoidedPhrases.join(", "),
        cta_style: answers.ctaStyle,
        formats_used: answers.formatsUsed.join(", "),
        emotional_temperature: answers.emotionalTemperature,
        golden_sentence: answers.goldenSentence,
        hard_rule: answers.hardRule
      };

      const res = await apiClient.post("/api/v1/voice/extract/questionnaire", {
        answers: payload
      });

      onSuccess(res.data.suggested_attributes);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to extract voice profile from questionnaire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header & Progress */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.18em] text-[#BFFF00] uppercase">
              {step} OF 8 — {STEPS[step - 1].title}
            </span>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 hover:bg-zinc-800"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s.id <= step ? "bg-[#BFFF00]" : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto min-h-[400px]">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What's your brand's tone?</h2>
                <p className="text-zinc-400 text-sm">Think of the words your best customer would use to describe your writing.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {TONE_OPTIONS.map(tone => {
                  const isSelected = answers.tone.includes(tone);
                  return (
                    <button
                      key={tone}
                      onClick={() => toggleArrayItem("tone", tone)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected 
                          ? "bg-[#BFFF00]/10 border border-[#BFFF00]/50 text-[#BFFF00]" 
                          : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
                      }`}
                    >
                      {tone}
                    </button>
                  )
                })}
              </div>
              <div className="pt-2">
                <label className="block text-xs font-mono text-zinc-500 mb-2">Other tones...</label>
                <input
                  type="text"
                  value={answers.toneOther}
                  onChange={e => setField("toneOther", e.target.value)}
                  placeholder="Add a tone word..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">How formal is your voice?</h2>
                <p className="text-zinc-400 text-sm">This shapes sentence length, vocabulary, and how you address your reader.</p>
              </div>
              <div className="space-y-3">
                {FORMALITY_OPTIONS.map(option => (
                  <label key={option} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                    answers.formality === option 
                      ? "bg-[#BFFF00]/5 border-[#BFFF00]/50" 
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
                  }`}>
                    <div className="flex-1 text-sm text-zinc-200">{option}</div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      answers.formality === option ? "border-[#BFFF00]" : "border-zinc-600"
                    }`}>
                      {answers.formality === option && <div className="w-2 h-2 rounded-full bg-[#BFFF00]" />}
                    </div>
                    <input 
                      type="radio" 
                      className="hidden" 
                      name="formality" 
                      checked={answers.formality === option} 
                      onChange={() => setField("formality", option)} 
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">How do your sentences tend to flow?</h2>
                <p className="text-zinc-400 text-sm">This affects rhythm, pacing, and how readers experience your copy.</p>
              </div>
              <div className="space-y-3">
                {SENTENCE_STYLE_OPTIONS.map(option => (
                  <label key={option} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                    answers.sentenceStyle === option 
                      ? "bg-[#BFFF00]/5 border-[#BFFF00]/50" 
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
                  }`}>
                    <div className="flex-1 text-sm text-zinc-200">{option}</div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      answers.sentenceStyle === option ? "border-[#BFFF00]" : "border-zinc-600"
                    }`}>
                      {answers.sentenceStyle === option && <div className="w-2 h-2 rounded-full bg-[#BFFF00]" />}
                    </div>
                    <input 
                      type="radio" 
                      className="hidden" 
                      name="sentenceStyle" 
                      checked={answers.sentenceStyle === option} 
                      onChange={() => setField("sentenceStyle", option)} 
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Which words or phrases make your copy sing?</h2>
                <p className="text-zinc-400 text-sm">These are your signature go-to phrases — words that consistently convert or resonate.</p>
              </div>
              <form onSubmit={handleAddPowerWord} className="flex gap-3">
                <input
                  type="text"
                  value={powerWordInput}
                  onChange={e => setPowerWordInput(e.target.value)}
                  placeholder="e.g. proven, effortless, built for..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00]"
                />
                <button type="button" onClick={handleAddPowerWord} className="px-5 py-3 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 border border-zinc-700 transition-colors">
                  + Add
                </button>
              </form>
              
              {answers.powerWords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {answers.powerWords.map(word => (
                    <div key={word} className="px-3 py-1.5 rounded-full bg-[#BFFF00]/10 border border-[#BFFF00]/30 text-[#BFFF00] text-sm flex items-center gap-2">
                      {word}
                      <button onClick={() => toggleArrayItem("powerWords", word)} className="hover:text-white">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800/50">
                <p className="text-xs font-semibold text-zinc-500 mb-3">Quick-add examples:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_POWER_WORDS.map(word => (
                    <button
                      key={word}
                      onClick={() => !answers.powerWords.includes(word) && toggleArrayItem("powerWords", word)}
                      className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:border-zinc-700 hover:text-zinc-300 transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What phrases do you always cut?</h2>
                <p className="text-zinc-400 text-sm">Clichés, competitor terms, or anything that sounds off-brand for you.</p>
              </div>
              <form onSubmit={handleAddAvoidedWord} className="flex gap-3">
                <input
                  type="text"
                  value={avoidedWordInput}
                  onChange={e => setAvoidedWordInput(e.target.value)}
                  placeholder="e.g. synergy, unlock your potential..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00]"
                />
                <button type="button" onClick={handleAddAvoidedWord} className="px-5 py-3 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 border border-zinc-700 transition-colors">
                  + Add
                </button>
              </form>
              
              {answers.avoidedPhrases.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {answers.avoidedPhrases.map(word => (
                    <div key={word} className="px-3 py-1.5 rounded-full bg-[#BFFF00]/10 border border-[#BFFF00]/30 text-[#BFFF00] text-sm flex items-center gap-2">
                      {word}
                      <button onClick={() => toggleArrayItem("avoidedPhrases", word)} className="hover:text-white">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800/50">
                <p className="text-xs font-semibold text-zinc-500 mb-3">Quick-add examples:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_AVOIDED_WORDS.map(word => (
                    <button
                      key={word}
                      onClick={() => !answers.avoidedPhrases.includes(word) && toggleArrayItem("avoidedPhrases", word)}
                      className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:border-zinc-700 hover:text-zinc-300 transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">How do your CTAs usually read?</h2>
                <p className="text-zinc-400 text-sm">This shapes every button, link, and closing line we generate.</p>
              </div>
              <div className="space-y-3">
                {CTA_OPTIONS.map(option => (
                  <label key={option} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                    answers.ctaStyle === option 
                      ? "bg-[#BFFF00]/5 border-[#BFFF00]/50" 
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
                  }`}>
                    <div className="flex-1 text-sm text-zinc-200">{option}</div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      answers.ctaStyle === option ? "border-[#BFFF00]" : "border-zinc-600"
                    }`}>
                      {answers.ctaStyle === option && <div className="w-2 h-2 rounded-full bg-[#BFFF00]" />}
                    </div>
                    <input 
                      type="radio" 
                      className="hidden" 
                      name="ctaStyle" 
                      checked={answers.ctaStyle === option} 
                      onChange={() => setField("ctaStyle", option)} 
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What formats do you write in — and what feeling do you aim for?</h2>
                <p className="text-zinc-400 text-sm">Select all formats you use, then pick the emotional register your copy usually sits in.</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-zinc-400 mb-3">Formats you write:</p>
                <div className="flex flex-wrap gap-2">
                  {FORMAT_OPTIONS.map(fmt => {
                    const isSelected = answers.formatsUsed.includes(fmt);
                    return (
                      <button
                        key={fmt}
                        onClick={() => toggleArrayItem("formatsUsed", fmt)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          isSelected 
                            ? "bg-[#BFFF00]/10 border border-[#BFFF00]/50 text-[#BFFF00]" 
                            : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
                        }`}
                      >
                        {fmt}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-400 mb-3">Emotional temperature:</p>
                <div className="space-y-2">
                  {EMOTIONAL_TEMP_OPTIONS.map(option => (
                    <label key={option} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      answers.emotionalTemperature === option 
                        ? "bg-[#BFFF00]/5 border-[#BFFF00]/50" 
                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
                    }`}>
                      <div className="flex-1 text-sm text-zinc-200">{option}</div>
                      <input 
                        type="radio" 
                        className="hidden" 
                        name="emotionalTemp" 
                        checked={answers.emotionalTemperature === option} 
                        onChange={() => setField("emotionalTemperature", option)} 
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Almost done — any golden rules?</h2>
                <p className="text-zinc-400 text-sm">Drop a sentence that nails your voice, and one hard rule we should never break.</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-400 mb-3">
                  A sentence that nails your voice:
                </label>
                <textarea
                  value={answers.goldenSentence}
                  onChange={e => setField("goldenSentence", e.target.value)}
                  placeholder='e.g. "Stop guessing. Start closing."'
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] min-h-[100px] resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-400 mb-3">
                  One hard rule (never do this):
                </label>
                <textarea
                  value={answers.hardRule}
                  onChange={e => setField("hardRule", e.target.value)}
                  placeholder="e.g. Never use exclamation marks. Never mention competitors."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] min-h-[100px] resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-zinc-800/50 flex items-center justify-between bg-[#18181b]">
          <div className="text-xs text-zinc-500 font-mono font-medium">
            {step} / 8
          </div>
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:border-zinc-700 hover:text-white transition-all duration-200 disabled:opacity-50"
              >
                ← Back
              </button>
            )}
            {step < 8 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-[#BFFF00] text-zinc-950 text-sm font-bold hover:bg-[#d4ff4d] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(191,255,0,0.15)]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-zinc-900" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Extracting...
                  </>
                ) : (
                  "Build my voice profile →"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
