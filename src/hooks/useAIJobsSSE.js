// src/hooks/useAIJobsSSE.js
// ---------------------------------------------------------
// 🤖 AI Jobs SSE – status på AI-uppdrag, köer, fel
// ---------------------------------------------------------

import { useCallback } from "react";
import { useSSEChannel } from "./useSSEChannel";
import { toast } from "sonner";

/**
 * useAIJobsSSE
 *
 * Backend-förslag:
 * { type: "ai_job_started", data: { jobId, kind, meta } }
 * { type: "ai_job_finished", data: { jobId, result, durationMs } }
 * { type: "ai_job_failed", data: { jobId, error } }
 */
export function useAIJobsSSE({
  enabled = true,
  onJobStarted,
  onJobFinished,
  onJobFailed,
}) {
  const handleTyped = useCallback(
    (type, data) => {
      switch (type) {
        case "ai_job_started":
          onJobStarted && onJobStarted(data);
          break;
        case "ai_job_finished":
          onJobFinished && onJobFinished(data);
          break;
        case "ai_job_failed":
          onJobFailed && onJobFailed(data);
          if (data?.error) {
            toast.error(`AI-jobb misslyckades: ${data.error}`);
          }
          break;
        default:
          break;
      }
    },
    [onJobStarted, onJobFinished, onJobFailed]
  );

  useSSEChannel({
    path: "/api/admin/ai-jobs/stream", // 🧩 backend: koppla mot gptJobService / queue
    enabled,
    onTyped: handleTyped,
    description: "AI-jobb (admin realtime)",
  });
}
