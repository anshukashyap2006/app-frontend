import { useState, useEffect } from "react";
import apiClient from "../../../Api/api";

/**
 * Hook for the New Project modal.
 *
 * - Fetches the user's brand briefs on mount.
 * - Exposes a `createProject` function that sends a POST /api/v1/projects/
 *   with either `mode: "existing"` or `mode: "new"` depending on whether
 *   the user picked an existing brief or filled one inline.
 */
export function useCreateProject(isOpen = true) {
  const [brandBriefs, setBrandBriefs] = useState([]);
  const [loadingBriefs, setLoadingBriefs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch brand briefs on mount or when modal opens
  useEffect(() => {
    async function fetchBriefs() {
      if (!isOpen) return;
      setLoadingBriefs(true);
      try {
        const res = await apiClient.get("/api/v1/brand-briefs/");
        setBrandBriefs(res.data);
      } catch (err) {
        console.error("Failed to fetch brand briefs:", err);
        // Non-blocking — user can still create a new brief inline
      } finally {
        setLoadingBriefs(false);
      }
    }
    fetchBriefs();
  }, [isOpen]);

  /**
   * Create a project.
   *
   * @param {Object} formData - The complete form data from all steps
   * @param {string} formData.name - Project name
   * @param {string} [formData.description] - Project description
   * @param {"existing"|"new"} formData.briefMode - Which flow the user chose
   * @param {string} [formData.brandBriefId] - UUID of existing brief (when briefMode === "existing")
   * @param {Object} [formData.newBrief] - Inline brief fields (when briefMode === "new")
   * @returns {Promise<Object>} The created project from the API
   */
  async function createProject(formData) {
    setIsSubmitting(true);
    setError(null);

    try {
      let body;

      if (formData.briefMode === "existing") {
        body = {
          mode: "existing",
          name: formData.name,
          description: formData.description || null,
          brand_brief_id: formData.brandBriefId,
        };
      } else {
        body = {
          mode: "new",
          name: formData.name,
          description: formData.description || null,
          brief_name: formData.newBrief.brief_name,
          product_name: formData.newBrief.product_name,
          product_description: formData.newBrief.product_description,
          target_avatar: formData.newBrief.target_avatar,
          key_objections: formData.newBrief.key_objections || null,
          unique_mechanism: formData.newBrief.unique_mechanism || null,
          competitor_notes: formData.newBrief.competitor_notes || null,
        };
      }

      const res = await apiClient.post("/api/v1/projects/", body);
      return res.data;
    } catch (err) {
      const rawDetail = err.response?.data?.detail;
      let errorMsg;
      if (Array.isArray(rawDetail)) {
        errorMsg = rawDetail.map((e) => e.msg).join(", ");
      } else if (typeof rawDetail === "string") {
        errorMsg = rawDetail;
      } else {
        errorMsg = err.message;
      }
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    brandBriefs,
    loadingBriefs,
    createProject,
    isSubmitting,
    error,
  };
}
