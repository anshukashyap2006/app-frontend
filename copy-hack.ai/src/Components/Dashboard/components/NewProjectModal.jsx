import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCreateProject } from "../hooks/useCreateProject";

// ─── Icons ────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="10" opacity="0.3" />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="23" />
  </svg>
);

// ─── Step config ──────────────────────────────────────────────────────────────

const STEP_LABELS = [
  "PROJECT DETAILS",
  "BRAND BRIEF",
  "VOICE PROFILE",
  "REVIEW",
];

const INITIAL_FORM = {
  // Step 1
  name: "",
  description: "",
  // Step 2
  briefMode: null,       // "existing" | "new"
  brandBriefId: null,     // uuid when picking existing
  newBrief: {
    brief_name: "",
    product_name: "",
    product_description: "",
    target_avatar: "",
    key_objections: "",
    unique_mechanism: "",
    competitor_notes: "",
  },
  // Step 3
  voiceProfileId: null,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function NewProjectModal({ isOpen, onClose, voiceProfiles = [], onProjectCreated }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("right"); // animation direction
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const contentRef = useRef(null);

  const {
    brandBriefs,
    loadingBriefs,
    createProject,
    isSubmitting,
    error: submitError,
  } = useCreateProject();

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDirection("right");
      setFormData(INITIAL_FORM);
      setErrors({});
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Auto-select voice profile if only one exists
  useEffect(() => {
    if (voiceProfiles.length === 1 && !formData.voiceProfileId) {
      setFormData((prev) => ({ ...prev, voiceProfileId: voiceProfiles[0].id }));
    }
  }, [voiceProfiles, formData.voiceProfileId]);

  // Scroll content to top when step changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Close on escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ─── Form helpers ─────────────────────────────────────────────────────────

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  const updateBriefField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      newBrief: { ...prev.newBrief, [field]: value },
    }));
    setErrors((prev) => ({ ...prev, [`brief_${field}`]: null }));
  }, []);

  // ─── Validation ───────────────────────────────────────────────────────────

  function validateStep(s) {
    const errs = {};

    if (s === 1) {
      if (!formData.name.trim()) errs.name = "Project name is required";
    }

    if (s === 2) {
      if (!formData.briefMode) {
        errs.briefMode = "Select a brand brief or create a new one";
      }
      if (formData.briefMode === "existing" && !formData.brandBriefId) {
        errs.briefMode = "Please select a brand brief";
      }
      if (formData.briefMode === "new") {
        if (!formData.newBrief.brief_name.trim()) errs.brief_brief_name = "Brief name is required";
        if (!formData.newBrief.product_name.trim()) errs.brief_product_name = "Product name is required";
        if (!formData.newBrief.product_description.trim()) errs.brief_product_description = "Product description is required";
        if (!formData.newBrief.target_avatar.trim()) errs.brief_target_avatar = "Target avatar is required";
      }
    }

    if (s === 3) {
      if (!formData.voiceProfileId) errs.voiceProfileId = "Please select a voice profile";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  function goNext() {
    if (!validateStep(step)) return;
    setDirection("right");
    setStep((s) => Math.min(s + 1, 4));
  }

  function goBack() {
    setDirection("left");
    setStep((s) => Math.max(s - 1, 1));
  }

  function goToStep(s) {
    setDirection(s < step ? "left" : "right");
    setStep(s);
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit() {
    try {
      const project = await createProject(formData);
      onProjectCreated?.(project);
      onClose();
    } catch {
      // error state handled by the hook
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 modal-overlay"
      style={{ background: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      id="new-project-modal-overlay"
    >
      <div
        className="modal-card w-full max-w-[640px] bg-zinc-900 border border-zinc-800/60 rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "min(90vh, 780px)" }}
        id="new-project-modal-card"
      >
        {/* Header: step label + progress bar + close */}
        <div className="px-7 pt-6 pb-5 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-mono font-semibold tracking-[0.15em] text-zinc-500 uppercase">
              {step} of 4 — {STEP_LABELS[step - 1]}
            </p>
            <button
              onClick={onClose}
              className="text-zinc-600 hover:text-zinc-400 transition-colors p-1 -m-1 rounded-lg hover:bg-zinc-800/50"
              aria-label="Close modal"
              id="new-project-modal-close"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="flex-1 h-1 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: s <= step ? "#BFFF00" : "rgba(39, 39, 42, 0.8)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-7 pb-7 modal-scroll"
        >
          <div
            key={step}
            className={direction === "right" ? "step-enter-right" : "step-enter-left"}
          >
            {step === 1 && (
              <StepProjectDetails
                formData={formData}
                errors={errors}
                updateField={updateField}
              />
            )}
            {step === 2 && (
              <StepBrandBrief
                formData={formData}
                errors={errors}
                updateField={updateField}
                updateBriefField={updateBriefField}
                brandBriefs={brandBriefs}
                loadingBriefs={loadingBriefs}
              />
            )}
            {step === 3 && (
              <StepVoiceProfile
                formData={formData}
                errors={errors}
                updateField={updateField}
                voiceProfiles={voiceProfiles}
              />
            )}
            {step === 4 && (
              <StepReview
                formData={formData}
                brandBriefs={brandBriefs}
                voiceProfiles={voiceProfiles}
                goToStep={goToStep}
                submitError={submitError}
              />
            )}
          </div>
        </div>

        {/* Footer: navigation buttons */}
        <div className="px-7 py-5 border-t border-zinc-800/60 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Back */}
            {step > 1 ? (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                id="new-project-btn-back"
              >
                <ArrowLeftIcon />
                Back
              </button>
            ) : (
              <div />
            )}

            {/* Next / Submit */}
            {step < 4 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/50 text-white text-sm font-medium hover:bg-zinc-700 hover:border-zinc-600/60 transition-all duration-200"
                id="new-project-btn-next"
              >
                Next: {STEP_LABELS[step]}
                <ArrowRightIcon />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#BFFF00] text-zinc-900 text-sm font-semibold hover:bg-[#d4ff4d] active:bg-[#a8e600] transition-all duration-200 shadow-[0_0_20px_rgba(191,255,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                id="new-project-btn-submit"
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon />
                    Creating…
                  </>
                ) : (
                  <>
                    <CheckIcon />
                    Create Project
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════════
   Step 1 — Project Details
   ═══════════════════════════════════════════════════════════════════════════════ */

function StepProjectDetails({ formData, errors, updateField }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
        Project Basics
      </h2>
      <p className="text-zinc-500 text-sm mb-8">
        Let's start by giving your new project a home.
      </p>

      {/* Project Name */}
      <div className="mb-6">
        <label className="block text-white text-sm font-semibold mb-2">
          Project Name
        </label>
        <input
          type="text"
          className={`modal-input ${errors.name ? "has-error" : ""}`}
          placeholder="e.g. Q4 Email Launch, LinkedIn Rebrand, Black Friday VSL"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          autoFocus
          id="new-project-input-name"
        />
        {errors.name ? (
          <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
        ) : (
          <p className="text-zinc-600 text-xs mt-1.5">
            Give it a name you'll recognize later.
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Description{" "}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-800 text-zinc-500 border border-zinc-700/40 ml-2">
            Optional
          </span>
        </label>
        <textarea
          className="modal-input modal-textarea"
          placeholder="What's this project for? Any context that'll help you remember it — campaign goals, deadlines, notes to self…"
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          id="new-project-input-description"
        />
        <p className="text-zinc-600 text-xs mt-1.5">
          Not used by AI — just for your own reference.
        </p>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════════
   Step 2 — Brand Brief
   ═══════════════════════════════════════════════════════════════════════════════ */

function StepBrandBrief({ formData, errors, updateField, updateBriefField, brandBriefs, loadingBriefs }) {
  const hasExistingBriefs = brandBriefs.length > 0;
  const isCreatingNew = formData.briefMode === "new";

  // Auto-set to "new" if no existing briefs
  useEffect(() => {
    if (!loadingBriefs && !hasExistingBriefs && formData.briefMode !== "new") {
      updateField("briefMode", "new");
    }
  }, [loadingBriefs, hasExistingBriefs, formData.briefMode, updateField]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
        Brand Brief
      </h2>
      <p className="text-zinc-500 text-sm mb-6">
        Connect your project to a brand so the AI knows what it's writing about.
      </p>

      {errors.briefMode && (
        <p className="text-red-400 text-xs mb-4 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          {errors.briefMode}
        </p>
      )}

      {/* Loading state */}
      {loadingBriefs && (
        <div className="flex items-center justify-center py-12">
          <SpinnerIcon />
          <span className="text-zinc-500 text-sm ml-3">Loading brand briefs…</span>
        </div>
      )}

      {/* Existing briefs — selectable cards */}
      {!loadingBriefs && hasExistingBriefs && !isCreatingNew && (
        <div className="space-y-3 mb-5">
          <p className="text-[11px] font-mono font-semibold tracking-[0.15em] text-zinc-600 uppercase mb-3">
            Your Brand Briefs
          </p>
          {brandBriefs.map((brief) => (
            <button
              key={brief.id}
              onClick={() => {
                updateField("briefMode", "existing");
                updateField("brandBriefId", brief.id);
              }}
              className={`w-full text-left rounded-xl p-4 border transition-all duration-200 group ${
                formData.brandBriefId === brief.id
                  ? "bg-[#BFFF00]/5 border-[#BFFF00]/30"
                  : "bg-zinc-800/40 border-zinc-700/30 hover:border-zinc-600/50 hover:bg-zinc-800/60"
              }`}
              id={`brief-card-${brief.id}`}
            >
              <div className="flex items-center gap-3">
                {/* Radio dot */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  formData.brandBriefId === brief.id
                    ? "border-[#BFFF00] bg-[#BFFF00]"
                    : "border-zinc-600 group-hover:border-zinc-500"
                }`}>
                  {formData.brandBriefId === brief.id && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {brief.name}
                  </p>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">
                    {brief.product_name} — {brief.product_description?.substring(0, 60)}…
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* Create new option */}
          <button
            onClick={() => {
              updateField("briefMode", "new");
              updateField("brandBriefId", null);
            }}
            className="w-full text-left rounded-xl p-4 border border-dashed border-zinc-700/50 hover:border-zinc-600 bg-transparent hover:bg-zinc-800/30 transition-all duration-200 group"
            id="brief-create-new-btn"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-dashed border-zinc-600 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 group-hover:text-zinc-400">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <p className="text-zinc-500 text-sm font-medium group-hover:text-zinc-300 transition-colors">
                Create a new Brand Brief
              </p>
            </div>
          </button>
        </div>
      )}

      {/* New brief form */}
      {!loadingBriefs && isCreatingNew && (
        <div>
          {/* Back to selection if they have existing briefs */}
          {hasExistingBriefs && (
            <button
              onClick={() => {
                updateField("briefMode", null);
                updateField("brandBriefId", null);
              }}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-5"
            >
              <ArrowLeftIcon />
              Back to existing briefs
            </button>
          )}

          <p className="text-[11px] font-mono font-semibold tracking-[0.15em] text-zinc-600 uppercase mb-4">
            {hasExistingBriefs ? "New Brand Brief" : "Create Your First Brand Brief"}
          </p>

          <div className="space-y-5">
            {/* Brief Name */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Brief Name
              </label>
              <input
                type="text"
                className={`modal-input ${errors.brief_brief_name ? "has-error" : ""}`}
                placeholder="e.g. Acme SaaS, My Coaching Brand"
                value={formData.newBrief.brief_name}
                onChange={(e) => updateBriefField("brief_name", e.target.value)}
                id="brief-input-name"
              />
              {errors.brief_brief_name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.brief_brief_name}</p>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Product / Service Name
              </label>
              <input
                type="text"
                className={`modal-input ${errors.brief_product_name ? "has-error" : ""}`}
                placeholder="e.g. CopyHack Pro, The Funnel Builder Course"
                value={formData.newBrief.product_name}
                onChange={(e) => updateBriefField("product_name", e.target.value)}
                id="brief-input-product-name"
              />
              {errors.brief_product_name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.brief_product_name}</p>
              )}
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Product Description
              </label>
              <textarea
                className={`modal-input modal-textarea ${errors.brief_product_description ? "has-error" : ""}`}
                placeholder="What does your product/service do? What problem does it solve? What's the big promise?"
                value={formData.newBrief.product_description}
                onChange={(e) => updateBriefField("product_description", e.target.value)}
                id="brief-input-product-desc"
              />
              {errors.brief_product_description && (
                <p className="text-red-400 text-xs mt-1.5">{errors.brief_product_description}</p>
              )}
            </div>

            {/* Target Avatar */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Target Avatar
              </label>
              <textarea
                className={`modal-input modal-textarea ${errors.brief_target_avatar ? "has-error" : ""}`}
                placeholder="Who is your ideal customer? Demographics, pain points, desires, current situation…"
                value={formData.newBrief.target_avatar}
                onChange={(e) => updateBriefField("target_avatar", e.target.value)}
                id="brief-input-target-avatar"
              />
              {errors.brief_target_avatar && (
                <p className="text-red-400 text-xs mt-1.5">{errors.brief_target_avatar}</p>
              )}
            </div>

            {/* Optional fields */}
            <div className="border-t border-zinc-800/50 pt-5">
              <p className="text-[11px] font-mono font-semibold tracking-[0.15em] text-zinc-600 uppercase mb-4">
                Optional — but helps the AI
              </p>

              {/* Key Objections */}
              <div className="mb-5">
                <label className="block text-white text-sm font-semibold mb-2">
                  Key Objections
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-800 text-zinc-500 border border-zinc-700/40 ml-2">
                    Optional
                  </span>
                </label>
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="What are the top reasons people say no? Price, trust, timing…"
                  value={formData.newBrief.key_objections}
                  onChange={(e) => updateBriefField("key_objections", e.target.value)}
                  style={{ minHeight: "80px" }}
                  id="brief-input-objections"
                />
              </div>

              {/* Unique Mechanism */}
              <div className="mb-5">
                <label className="block text-white text-sm font-semibold mb-2">
                  Unique Mechanism
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-800 text-zinc-500 border border-zinc-700/40 ml-2">
                    Optional
                  </span>
                </label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="What makes your approach different? The proprietary framework, method, or technology."
                  value={formData.newBrief.unique_mechanism}
                  onChange={(e) => updateBriefField("unique_mechanism", e.target.value)}
                  id="brief-input-mechanism"
                />
              </div>

              {/* Competitor Notes */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Competitor Notes
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-800 text-zinc-500 border border-zinc-700/40 ml-2">
                    Optional
                  </span>
                </label>
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="Who are your main competitors? What do they get wrong that you get right?"
                  value={formData.newBrief.competitor_notes}
                  onChange={(e) => updateBriefField("competitor_notes", e.target.value)}
                  style={{ minHeight: "80px" }}
                  id="brief-input-competitors"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════════
   Step 3 — Voice Profile
   ═══════════════════════════════════════════════════════════════════════════════ */

const PROFILE_DOT_COLORS = ["#BFFF00", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#DDA0DD"];

function StepVoiceProfile({ formData, errors, updateField, voiceProfiles }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
        Voice Profile
      </h2>
      <p className="text-zinc-500 text-sm mb-6">
        Which voice should we write in? Pick the profile that matches this project.
      </p>

      {errors.voiceProfileId && (
        <p className="text-red-400 text-xs mb-4 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          {errors.voiceProfileId}
        </p>
      )}

      {voiceProfiles.length === 0 ? (
        <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-8 text-center">
          <p className="text-zinc-500 text-sm">
            No voice profiles found. Create one from your dashboard first.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {voiceProfiles.map((profile, idx) => {
            const isSelected = formData.voiceProfileId === profile.id;
            const dotColor = PROFILE_DOT_COLORS[idx % PROFILE_DOT_COLORS.length];
            const toneWords = profile.attributes?.tone_words || [];

            return (
              <button
                key={profile.id}
                onClick={() => updateField("voiceProfileId", profile.id)}
                className={`w-full text-left rounded-xl p-4 border transition-all duration-200 group ${
                  isSelected
                    ? "bg-[#BFFF00]/5 border-[#BFFF00]/30"
                    : "bg-zinc-800/40 border-zinc-700/30 hover:border-zinc-600/50 hover:bg-zinc-800/60"
                }`}
                id={`voice-card-${profile.id}`}
              >
                <div className="flex items-start gap-3">
                  {/* Radio dot */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? "border-[#BFFF00] bg-[#BFFF00]"
                      : "border-zinc-600 group-hover:border-zinc-500"
                  }`}>
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dotColor }}
                      />
                      <p className="text-white text-sm font-medium truncate">
                        {profile.profile_name}
                      </p>
                      {profile.is_default && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#BFFF00]/10 text-[#BFFF00] border border-[#BFFF00]/20">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Tone tags */}
                    {toneWords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {toneWords.slice(0, 5).map((word) => (
                          <span
                            key={word}
                            className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-700/30"
                          >
                            {word}
                          </span>
                        ))}
                        {toneWords.length > 5 && (
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-600">
                            +{toneWords.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════════
   Step 4 — Review & Confirm
   ═══════════════════════════════════════════════════════════════════════════════ */

function StepReview({ formData, brandBriefs, voiceProfiles, goToStep, submitError }) {
  // Resolve names from IDs
  const selectedBrief =
    formData.briefMode === "existing"
      ? brandBriefs.find((b) => b.id === formData.brandBriefId)
      : null;

  const selectedVoice = voiceProfiles.find((v) => v.id === formData.voiceProfileId);

  const briefName =
    formData.briefMode === "existing"
      ? selectedBrief?.name
      : formData.newBrief.brief_name;

  const briefProduct =
    formData.briefMode === "existing"
      ? selectedBrief?.product_name
      : formData.newBrief.product_name;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
        Review & Create
      </h2>
      <p className="text-zinc-500 text-sm mb-6">
        Everything looks good? Let's go.
      </p>

      {submitError && (
        <div className="mb-5 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Project summary */}
        <ReviewCard
          label="PROJECT"
          onEdit={() => goToStep(1)}
        >
          <p className="text-white text-sm font-medium">{formData.name}</p>
          {formData.description && (
            <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{formData.description}</p>
          )}
        </ReviewCard>

        {/* Brand Brief summary */}
        <ReviewCard
          label="BRAND BRIEF"
          onEdit={() => goToStep(2)}
          badge={formData.briefMode === "new" ? "New" : null}
        >
          <p className="text-white text-sm font-medium">{briefName}</p>
          <p className="text-zinc-500 text-xs mt-1">{briefProduct}</p>
        </ReviewCard>

        {/* Voice Profile summary */}
        <ReviewCard
          label="VOICE PROFILE"
          onEdit={() => goToStep(3)}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: PROFILE_DOT_COLORS[
                  voiceProfiles.findIndex((v) => v.id === formData.voiceProfileId) %
                    PROFILE_DOT_COLORS.length
                ] || PROFILE_DOT_COLORS[0],
              }}
            />
            <p className="text-white text-sm font-medium">
              {selectedVoice?.profile_name || "Unknown"}
            </p>
          </div>
        </ReviewCard>
      </div>
    </div>
  );
}


/* ─── Shared Sub-components ─────────────────────────────────────────────────── */

function ReviewCard({ label, onEdit, badge, children }) {
  return (
    <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-mono font-semibold tracking-[0.15em] text-zinc-600 uppercase">
            {label}
          </p>
          {badge && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#BFFF00]/10 text-[#BFFF00] border border-[#BFFF00]/20">
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-[#BFFF00] transition-colors"
        >
          <EditIcon />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}
