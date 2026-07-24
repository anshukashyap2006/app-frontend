import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../Api/api";
import { QuestionnaireModal } from "./components/QuestionnaireModal";

function arrayToCommaStr(arr) {
  return Array.isArray(arr) ? arr.join(", ") : "";
}
function arrayToNewlineStr(arr) {
  return Array.isArray(arr) ? arr.join("\n") : "";
}
function commaStrToArray(str) {
  return str.split(",").map(s => s.trim()).filter(Boolean);
}
function newlineStrToArray(str) {
  return str.split("\n").map(s => s.trim()).filter(Boolean);
}

export function VoiceProfileUploadPage({ setBreadcrumbs }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const method = searchParams.get("method") || "upload";

  const [files, setFiles] = useState([]);
  const [pastedText, setPastedText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1); // 1: upload/questionnaire, 2: review
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(method === "questionnaire");

  useEffect(() => {
    if (method === "questionnaire") {
      setIsQuestionnaireOpen(true);
    }
  }, [method]);
  
  const [formData, setFormData] = useState({
    profile_name: "",
    is_default: false,
    attributes: {
      tone_words: "",
      formality_level: "",
      sentence_style: "",
      power_words: "",
      avoided_phrases: "",
      cta_style: "",
      formats_used: "",
      emotional_temperature: "",
      example_phrases: "",
      prohibitions: "",
    }
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (setBreadcrumbs) {
      setBreadcrumbs([
        { label: "Voice Profiles", path: "/dashboard/voice-profiles" },
        { label: "Upload & Extract", path: "/dashboard/voice/create" }
      ]);
    }
  }, [setBreadcrumbs]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return false;

    const allowedTypes = [
      "text/plain", 
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt') && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx')) {
      setError("Invalid file format. Please upload .txt, .pdf, or .docx");
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(validateFile);
      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
        setPastedText(""); // Clear pasted text if files are added
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(validateFile);
      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
        setPastedText(""); // Clear pasted text if files are added
      }
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleExtract = async () => {
    if (files.length === 0 && !pastedText.trim()) return;
    setLoading(true);
    setError(null);

    const formDataUpload = new FormData();
    if (files.length > 0) {
      files.forEach(f => formDataUpload.append("files", f));
    } else if (pastedText.trim()) {
      const blob = new Blob([pastedText], { type: 'text/plain' });
      formDataUpload.append("files", blob, "pasted_text.txt");
    }

    try {
      const res = await apiClient.post("/api/v1/voice/extract", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const suggested = res.data.suggested_attributes;
      setFormData(prev => ({
        ...prev,
        attributes: {
          tone_words: arrayToCommaStr(suggested.tone_words),
          power_words: arrayToCommaStr(suggested.power_words),
          avoided_phrases: arrayToCommaStr(suggested.avoided_phrases),
          formats_used: arrayToCommaStr(suggested.formats_used),
          example_phrases: arrayToNewlineStr(suggested.example_phrases),
          prohibitions: arrayToNewlineStr(suggested.prohibitions),
          formality_level: suggested.formality_level || "",
          sentence_style: suggested.sentence_style || "",
          cta_style: suggested.cta_style || "",
          emotional_temperature: suggested.emotional_temperature || "",
        }
      }));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to extract voice profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionnaireSuccess = (suggested) => {
    setIsQuestionnaireOpen(false);
    setSearchParams({});
    setFormData(prev => ({
      ...prev,
      attributes: {
        tone_words: arrayToCommaStr(suggested.tone_words),
        power_words: arrayToCommaStr(suggested.power_words),
        avoided_phrases: arrayToCommaStr(suggested.avoided_phrases),
        formats_used: arrayToCommaStr(suggested.formats_used),
        example_phrases: arrayToNewlineStr(suggested.example_phrases),
        prohibitions: arrayToNewlineStr(suggested.prohibitions),
        formality_level: suggested.formality_level || "",
        sentence_style: suggested.sentence_style || "",
        cta_style: suggested.cta_style || "",
        emotional_temperature: suggested.emotional_temperature || "",
      }
    }));
    setStep(2);
  };

  const handleQuestionnaireClose = () => {
    setIsQuestionnaireOpen(false);
    setSearchParams({ method: "upload" });
  };

  const handleAttrChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [field]: value
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.profile_name.trim()) {
      setError("Please provide a profile name.");
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/api/v1/voice/`, {
        profile_name: formData.profile_name.trim(),
        is_default: formData.is_default,
        attributes: {
          tone_words: commaStrToArray(formData.attributes.tone_words),
          power_words: commaStrToArray(formData.attributes.power_words),
          avoided_phrases: commaStrToArray(formData.attributes.avoided_phrases),
          formats_used: commaStrToArray(formData.attributes.formats_used),
          example_phrases: newlineStrToArray(formData.attributes.example_phrases),
          prohibitions: newlineStrToArray(formData.attributes.prohibitions),
          formality_level: formData.attributes.formality_level.trim(),
          sentence_style: formData.attributes.sentence_style.trim(),
          cta_style: formData.attributes.cta_style.trim(),
          emotional_temperature: formData.attributes.emotional_temperature.trim(),
        }
      });
      navigate("/dashboard/voice-profiles");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save voice profile.");
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Upload & Extract Voice</h1>
          <p className="text-sm text-zinc-400 mt-1">Upload a sample of your best copy to automatically extract your brand's unique voice.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>{error}</div>
          </div>
        )}

        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive ? "border-[#BFFF00] bg-[#BFFF00]/5" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".txt,.pdf,.docx"
            multiple
            onChange={handleChange}
          />
          
          <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-white mb-2">
            {files.length > 0 ? `${files.length} file(s) selected` : "Drag and drop your files here"}
          </h3>
          
          <div className="text-zinc-500 text-sm mb-6 flex flex-col items-center gap-2">
            {files.length > 0 ? (
              <div className="flex flex-col gap-1 items-center w-full max-w-sm">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between w-full bg-zinc-900/50 px-3 py-1.5 rounded text-xs border border-zinc-800">
                    <span className="truncate max-w-[200px] text-zinc-300">{f.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                        className="text-red-400 hover:text-red-300"
                        title="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : "Supports .TXT, .PDF, or .DOCX up to 5MB total"}
          </div>
          
          <button 
            onClick={() => { /* fileInputRef.current?.click() */ }}
            disabled={true}
            className="px-6 py-2.5 rounded-lg bg-zinc-800 text-white font-medium transition-colors text-sm opacity-50 cursor-not-allowed"
          >
            {files.length > 0 ? "Add more files (Soon)" : "Browse files (Soon)"}
          </button>
        </div>

        <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs font-mono tracking-widest uppercase">Or Paste Text</span>
            <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <div className="mb-6">
          <textarea
            value={pastedText}
            onChange={(e) => {
              setPastedText(e.target.value);
              if (e.target.value.trim() && files.length > 0) {
                setFiles([]); // Clear files if user starts typing
              }
            }}
            placeholder="Paste your best copy here..."
            className="w-full h-48 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all resize-y"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleExtract}
            disabled={(files.length === 0 && !pastedText.trim()) || loading}
            className="px-6 py-3 rounded-xl bg-[#BFFF00] text-zinc-950 font-semibold hover:bg-[#d4ff4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(191,255,0,0.15)]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-zinc-950" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Extracting AI Voice...
              </>
            ) : (
              "Extract Voice Profile"
            )}
          </button>
        </div>

        {isQuestionnaireOpen && (
          <QuestionnaireModal 
            isOpen={isQuestionnaireOpen} 
            onClose={handleQuestionnaireClose} 
            onSuccess={handleQuestionnaireSuccess} 
          />
        )}
      </div>
    );
  }

  // Step 2: Review & Edit
  return (
    <div className="min-h-full bg-zinc-950 px-6 py-8 md:px-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Review Voice Profile</h1>
        <p className="text-sm text-zinc-400 mt-1">We've extracted your brand's unique attributes. Review, tweak, and save.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form id="save-voice-form" onSubmit={handleSave} className="space-y-8 bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-6 md:p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                Profile Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.profile_name}
                onChange={e => setFormData({ ...formData, profile_name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                placeholder="e.g. Confident SaaS Founder"
              />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-950 border border-zinc-800 h-[50px]">
              <input
                type="checkbox"
                id="is-default-checkbox"
                checked={formData.is_default}
                onChange={e => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-700 text-[#BFFF00] focus:ring-[#BFFF00] focus:ring-offset-zinc-900 bg-zinc-800"
              />
              <label htmlFor="is-default-checkbox" className="text-sm font-medium text-white cursor-pointer select-none">
                Set as Default Voice Profile
              </label>
            </div>
          </div>

          <div className="border-t border-zinc-800/50 pt-6 mt-2">
            <p className="text-xs font-mono font-semibold tracking-[0.15em] text-zinc-500 uppercase mb-5">
              Extracted Voice Attributes
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  Tone Words (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.attributes.tone_words}
                  onChange={e => handleAttrChange("tone_words", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  Power Words (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.attributes.power_words}
                  onChange={e => handleAttrChange("power_words", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  Avoided Phrases (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.attributes.avoided_phrases}
                  onChange={e => handleAttrChange("avoided_phrases", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                  Formats Used (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.attributes.formats_used}
                  onChange={e => handleAttrChange("formats_used", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                Formality Level
              </label>
              <input
                type="text"
                value={formData.attributes.formality_level}
                onChange={e => handleAttrChange("formality_level", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                Emotional Temperature
              </label>
              <input
                type="text"
                value={formData.attributes.emotional_temperature}
                onChange={e => handleAttrChange("emotional_temperature", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                Sentence Style
              </label>
              <input
                type="text"
                value={formData.attributes.sentence_style}
                onChange={e => handleAttrChange("sentence_style", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                CTA Style
              </label>
              <input
                type="text"
                value={formData.attributes.cta_style}
                onChange={e => handleAttrChange("cta_style", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                Example Phrases (one per line)
              </label>
              <textarea
                value={formData.attributes.example_phrases}
                onChange={e => handleAttrChange("example_phrases", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[120px] resize-y leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                Prohibitions (one per line)
              </label>
              <textarea
                value={formData.attributes.prohibitions}
                onChange={e => handleAttrChange("prohibitions", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00] transition-all min-h-[120px] resize-y leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800/50 pt-6 mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-[#BFFF00] text-zinc-950 text-sm font-bold hover:bg-[#d4ff4d] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(191,255,0,0.15)]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-zinc-900" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving Profile...
              </>
            ) : (
              "Save Voice Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
