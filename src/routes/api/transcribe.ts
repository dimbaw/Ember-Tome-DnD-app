import { createFileRoute } from "@tanstack/react-router";
import { transcribeAudio } from "@/lib/ai/xai";
import { formatBytes, MAX_AUDIO_BYTES } from "@/lib/limits";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!process.env.XAI_API_KEY) {
            return Response.json(
              { ok: false, error: "AI is not available in this environment" },
              { status: 503 },
            );
          }
          const form = await request.formData();
          const file = form.get("file");
          if (!(file instanceof File)) {
            return Response.json({ ok: false, error: "No audio file" }, { status: 400 });
          }
          if (file.size > MAX_AUDIO_BYTES) {
            return Response.json(
              {
                ok: false,
                error: `Audio is too large (${formatBytes(file.size)}). The tome takes up to ${formatBytes(MAX_AUDIO_BYTES)} — compress a long night as m4a, mp3, or opus.`,
              },
              { status: 413 },
            );
          }
          const keyterms = form.getAll("keyterm").map(String);
          const result = await transcribeAudio(file, keyterms);
          return Response.json({ ok: true, ...result });
        } catch (err) {
          return Response.json(
            {
              ok: false,
              error: err instanceof Error ? err.message : "Transcription failed",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
