import { useState, useEffect } from "react";
import apiClient from "../../../Api/api";

export function useDashboard() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    user: null,
    subscription: null,
    voiceProfiles: [],
    projects: [],
    recentGenerations: [],
    stats: {
      generationsLeft: 0,
      generationsLimit: 0,
      generationsUsed: 0,
      projectCount: 0,
      voiceProfileCount: 0,
      thisMonthCopies: 0,
    },
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Parallel fetch — auth token is injected by the axios interceptor
        const [meRes, voiceRes, projectsRes, generationsRes] =
          await Promise.all([
            apiClient.get("/auth/me"),
            apiClient.get("/api/v1/voice/"),
            apiClient.get("/api/v1/projects/"),
            apiClient.get("/api/v1/generations/?limit=5"),
          ]);

        const sub = meRes.data.subscription;

        setState({
          loading: false,
          error: null,
          user: meRes.data,
          subscription: sub,
          voiceProfiles: voiceRes.data,
          projects: projectsRes.data,
          recentGenerations: generationsRes.data,
          stats: {
            generationsLeft:
              sub.generations_limit - sub.generations_used,
            generationsLimit: sub.generations_limit,
            generationsUsed: sub.generations_used,
            projectCount: projectsRes.data.length,
            voiceProfileCount: voiceRes.data.length,
            thisMonthCopies: sub.generations_used,
          },
        });
      } catch (err) {
        // FastAPI 422 returns detail as an array of objects [{type, loc, msg}]
        // FastAPI 401/404 returns detail as a string
        const rawDetail = err.response?.data?.detail;
        let errorMsg;
        if (Array.isArray(rawDetail)) {
          // 422 validation error — likely missing auth header
          errorMsg = rawDetail.map((e) => e.msg).join(", ");
        } else if (typeof rawDetail === "string") {
          errorMsg = rawDetail;
        } else {
          errorMsg = err.message;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
      }
    }
    fetchDashboard();
  }, []);

  return state;
}
