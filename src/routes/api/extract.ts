import { createFileRoute } from "@tanstack/react-router";
import {
  extractNotesFromDocument,
  extractNotesFromImage,
  transcribeAudio,
} from "@/lib/ai/xai";
import { formatBytes, MAX_AUDIO_BYTES, MAX_DOC_BYTES, MAX_IMAGE_SOURCE_BYTES } from "@/lib/limits";
import { sourceKind } from "@/lib/sources";

export const Route = createFileRoute("/api/extract")({
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
            return Response.json({ ok: false, error: "No file" }, { status: 400 });
          }
          const kind = sourceKind(file);
          const keyterms = form.getAll("keyterm").map(String);

          if (kind === "audio") {
            if (file.size > MAX_AUDIO_BYTES) {
              return Response.json(
                { ok: false, error: `Audio is too large (${formatBytes(file.size)}).` },
                { status: 413 },
              );
            }
            const result = await transcribeAudio(file, keyterms);
            return Response.json({ ok: true, text: result.text, kind });
          }

          if (kind === "image") {
            if (file.size > MAX_IMAGE_SOURCE_BYTES) {
              return Response.json(
                { ok: false, error: `That picture is too large (${formatBytes(file.size)}).` },
                { status: 413 },
              );
            }
            const buf = Buffer.from(await file.arrayBuffer());
            const mime = file.type || "image/jpeg";
            const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
            const text = await extractNotesFromImage(dataUrl, file.name);
            return Response.json({ ok: true, text, kind });
          }

          if (kind === "text") {
            if (file.size > MAX_DOC_BYTES) {
              return Response.json(
                { ok: false, error: `That file is too large (${formatBytes(file.size)}).` },
                { status: 413 },
              );
            }
            const raw = await file.text();
            const text = raw.trim();
            if (!text) {
              return Response.json({ ok: false, error: "That file was empty" }, { status: 400 });
            }
            return Response.json({ ok: true, text: text.slice(0, 120000), kind });
          }

          if (file.size > MAX_DOC_BYTES) {
            return Response.json(
              { ok: false, error: `That document is too large (${formatBytes(file.size)}).` },
              { status: 413 },
            );
          }
          const text = await extractNotesFromDocument(file);
          return Response.json({ ok: true, text, kind });
        } catch (err) {
          return Response.json(
            {
              ok: false,
              error: err instanceof Error ? err.message : "Could not read that file",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
