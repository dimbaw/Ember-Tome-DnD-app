import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { locationPrompt, portraitPrompt, scenePrompt } from "@/lib/art";

const XAI = "https://api.x.ai/v1";

export function apiKey() {
  return process.env.XAI_API_KEY ?? "";
}

export function requireKey() {
  const key = apiKey();
  if (!key) throw new Error("AI is not available in this environment");
  return key;
}

export async function toImageInput(src: string): Promise<{ url: string; type: "image_url" }> {
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
    return { url: src, type: "image_url" };
  }
  const rel = src.replace(/^\//, "").split("?")[0];
  const candidates = [
    join(process.cwd(), "public", rel),
    join(process.cwd(), "dist/client", rel),
    join(process.cwd(), ".output/public", rel),
  ];
  for (const path of candidates) {
    try {
      const buf = await readFile(path);
      const mime = rel.endsWith(".png") ? "image/png" : "image/jpeg";
      return { url: `data:${mime};base64,${buf.toString("base64")}`, type: "image_url" };
    } catch {
      /* try next */
    }
  }
  throw new Error(`Could not load reference image ${src}`);
}

function extractImageUrl(body: unknown): string {
  const rec = body as {
    url?: string;
    data?: { url?: string; b64_json?: string }[];
  };
  const first = rec.data?.[0];
  if (first?.url) return first.url;
  if (rec.url) return rec.url;
  if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;
  throw new Error("Imagine returned no image");
}

export async function chatJson<T>(system: string, user: string): Promise<T> {
  const key = requireKey();
  const res = await fetch(`${XAI}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.4,
      max_tokens: 3500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`xAI chat error ${res.status}: ${text.slice(0, 240)}`);
  }
  const body = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const raw = body.choices[0]?.message.content ?? "{}";
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned) as T;
}

export async function generatePortrait(appearance: string, ref?: string) {
  const key = requireKey();
  const prompt = ref
    ? `${portraitPrompt(appearance)} Keep this exact face, identity, and bone structure from the reference. Update costume, scars, and details to match the description.`
    : portraitPrompt(appearance);

  if (ref) {
    const image = await toImageInput(ref);
    const res = await fetch(`${XAI}/images/edits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt,
        image,
        aspect_ratio: "2:3",
        resolution: "1k",
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Portrait error ${res.status}: ${text.slice(0, 240)}`);
    }
    return extractImageUrl(await res.json());
  }

  const res = await fetch(`${XAI}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-image-2.0",
      prompt,
      n: 1,
      aspect_ratio: "2:3",
      resolution: "1k",
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Portrait error ${res.status}: ${text.slice(0, 240)}`);
  }
  return extractImageUrl(await res.json());
}

export async function generateScene(beat: string, appearances: string[], refs: string[]) {
  const key = requireKey();
  const prompt = scenePrompt(beat, appearances);
  const images = await Promise.all(refs.slice(0, 3).map(toImageInput));

  if (images.length > 0) {
    const res = await fetch(`${XAI}/images/edits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt,
        ...(images.length === 1 ? { image: images[0] } : { images }),
        aspect_ratio: "16:9",
        resolution: "1k",
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Scene edit error ${res.status}: ${text.slice(0, 240)}`);
    }
    return extractImageUrl(await res.json());
  }

  const res = await fetch(`${XAI}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-image-2.0",
      prompt,
      n: 1,
      aspect_ratio: "16:9",
      resolution: "1k",
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Scene error ${res.status}: ${text.slice(0, 240)}`);
  }
  return extractImageUrl(await res.json());
}

export async function generateLocation(name: string, description: string, ref?: string) {
  const key = requireKey();
  const prompt = ref
    ? `${locationPrompt(name, description)} Keep this exact place. Update lighting and details to match the description.`
    : locationPrompt(name, description);

  if (ref) {
    const image = await toImageInput(ref);
    const res = await fetch(`${XAI}/images/edits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt,
        image,
        aspect_ratio: "16:9",
        resolution: "1k",
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Place error ${res.status}: ${text.slice(0, 240)}`);
    }
    return extractImageUrl(await res.json());
  }

  const res = await fetch(`${XAI}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-image-2.0",
      prompt,
      n: 1,
      aspect_ratio: "16:9",
      resolution: "1k",
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Place error ${res.status}: ${text.slice(0, 240)}`);
  }
  return extractImageUrl(await res.json());
}

export async function startVideo(imageSrc: string, prompt: string) {
  const key = requireKey();
  const image = await toImageInput(imageSrc);
  const res = await fetch(`${XAI}/videos/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-video-1.5",
      prompt,
      image: { url: image.url },
      duration: 6,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Video start error ${res.status}: ${text.slice(0, 240)}`);
  }
  const body = (await res.json()) as { request_id?: string; id?: string };
  const id = body.request_id ?? body.id;
  if (!id) throw new Error("Video start returned no request id");
  return id;
}

export async function pollVideo(requestId: string) {
  const key = requireKey();
  const res = await fetch(`${XAI}/videos/${requestId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Video poll error ${res.status}: ${text.slice(0, 240)}`);
  }
  const body = (await res.json()) as {
    status?: string;
    video?: { url?: string };
    url?: string;
  };
  const status = body.status ?? "unknown";
  const url = body.video?.url ?? body.url;
  return { status, url };
}

export async function transcribeAudio(file: File, keyterms: string[]) {
  const key = requireKey();
  const form = new FormData();
  form.append("format", "true");
  form.append("language", "en");
  form.append("diarize", "true");
  for (const term of keyterms.slice(0, 40)) {
    if (term.trim()) form.append("keyterm", term.trim().slice(0, 50));
  }
  form.append("file", file, file.name || "session.webm");

  const res = await fetch(`${XAI}/stt`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Transcription error ${res.status}: ${text.slice(0, 240)}`);
  }
  const body = (await res.json()) as { text?: string; duration?: number };
  const text = (body.text ?? "").trim();
  if (!text) throw new Error("The recording produced an empty transcript");
  return { text, duration: body.duration ?? 0 };
}

const EXTRACT_SYSTEM = `You are the chronicler of a tabletop Dungeons & Dragons campaign.
Read the attached material (session notes, a transcript, a character sheet, a map, a screenshot, a handout, or a photograph of the table's papers).
Write plain session notes the rest of the chronicle can use:
- Who was there (names, race, class or role, locked visual appearance if shown or described)
- Places the DM described or that the map shows (architecture, light, weather, scale, one unforgettable detail)
- What happened: fights, choices, items, wounds, deaths
Past tense. No emoji. No JSON. If the source is a map or a place, describe it so an illustrator could paint it. If it is a character portrait or sheet, lock the face, costume, and gear. Mature 18+ fantasy is allowed. Adult characters only.`;

export async function extractNotesFromImage(dataUrl: string, filename: string) {
  const key = requireKey();
  const res = await fetch(`${XAI}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.2,
      max_tokens: 2500,
      messages: [
        { role: "system", content: EXTRACT_SYSTEM },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            {
              type: "text",
              text: `Source file: ${filename}. Extract everything useful as session notes.`,
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Could not read that picture (${res.status}): ${text.slice(0, 240)}`);
  }
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = (body.choices?.[0]?.message?.content ?? "").trim();
  if (!text) throw new Error("That picture produced no notes");
  return text;
}

export async function extractNotesFromText(source: string, filename: string) {
  const key = requireKey();
  const res = await fetch(`${XAI}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.2,
      max_tokens: 2500,
      messages: [
        { role: "system", content: EXTRACT_SYSTEM },
        {
          role: "user",
          content: `Source file: ${filename}\n\n"""\n${source.slice(0, 120000)}\n"""\n\nExtract everything useful as session notes.`,
        },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Could not read that document (${res.status}): ${text.slice(0, 240)}`);
  }
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = (body.choices?.[0]?.message?.content ?? "").trim();
  if (!text) throw new Error("That document produced no notes");
  return text;
}

function outputTextFromResponses(body: unknown): string {
  const rec = body as {
    output_text?: string;
    output?: {
      type?: string;
      content?: { type?: string; text?: string }[] | string;
      text?: string;
    }[];
    choices?: { message?: { content?: string } }[];
  };
  if (typeof rec.output_text === "string" && rec.output_text.trim()) return rec.output_text.trim();
  if (Array.isArray(rec.output)) {
    const chunks: string[] = [];
    for (const item of rec.output) {
      if (typeof item.text === "string") chunks.push(item.text);
      if (typeof item.content === "string") chunks.push(item.content);
      if (Array.isArray(item.content)) {
        for (const part of item.content) {
          if ((part.type === "output_text" || part.type === "text") && part.text) {
            chunks.push(part.text);
          }
        }
      }
    }
    const joined = chunks.join("\n").trim();
    if (joined) return joined;
  }
  const choice = rec.choices?.[0]?.message?.content?.trim();
  if (choice) return choice;
  return "";
}

export async function extractNotesFromDocument(file: File) {
  const key = requireKey();
  const form = new FormData();
  form.append("purpose", "assistants");
  form.append("expires_after", "3600");
  form.append("file", file, file.name || "handout.pdf");

  const up = await fetch(`${XAI}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!up.ok) {
    const text = await up.text().catch(() => "");
    throw new Error(`Could not take that document (${up.status}): ${text.slice(0, 240)}`);
  }
  const uploaded = (await up.json()) as { id?: string };
  if (!uploaded.id) throw new Error("That document did not bind");

  try {
    const res = await fetch(`${XAI}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `${EXTRACT_SYSTEM}\n\nSource file: ${file.name}. Extract everything useful as session notes.`,
              },
              { type: "input_file", file_id: uploaded.id },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Could not read that document (${res.status}): ${text.slice(0, 240)}`);
    }
    const text = outputTextFromResponses(await res.json());
    if (!text) throw new Error("That document produced no notes");
    return text;
  } finally {
    await fetch(`${XAI}/files/${uploaded.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${key}` },
    }).catch(() => undefined);
  }
}
