import { join } from "node:path";
import { readFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/xai-Bwb6QFJj.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var ART_BIBLE = "Dark-fantasy oil painting, soot and umber and bone pigments, Rembrandt firelight from the left, painterly brushwork with sharp readable faces, tactile costumes, no neon, no modern objects, no text, no watermark, no picture frame.";
function portraitPrompt(appearance) {
	return `Close-up oil portrait, three-quarter view. ${appearance} ${ART_BIBLE}`;
}
function scenePrompt(beat, appearances) {
	return `Cinematic wide oil painting. ${beat} ${appearances.length > 0 ? `Include these exact characters, matching their faces and costumes: ${appearances.join(" | ")}.` : ""} ${ART_BIBLE}`;
}
var xai_exports = /* @__PURE__ */ __exportAll({
	apiKey: () => apiKey,
	chatJson: () => chatJson,
	generatePortrait: () => generatePortrait,
	generateScene: () => generateScene,
	pollVideo: () => pollVideo,
	requireKey: () => requireKey,
	startVideo: () => startVideo,
	toImageInput: () => toImageInput,
	transcribeAudio: () => transcribeAudio
});
var XAI = "https://api.x.ai/v1";
function apiKey() {
	return process.env.XAI_API_KEY ?? "";
}
function requireKey() {
	const key = apiKey();
	if (!key) throw new Error("AI is not available in this environment");
	return key;
}
async function toImageInput(src) {
	if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) return {
		url: src,
		type: "image_url"
	};
	const rel = src.replace(/^\//, "");
	const candidates = [
		join(process.cwd(), "public", rel),
		join(process.cwd(), "dist/client", rel),
		join(process.cwd(), ".output/public", rel)
	];
	for (const path of candidates) try {
		const buf = await readFile(path);
		return {
			url: `data:${rel.endsWith(".png") ? "image/png" : "image/jpeg"};base64,${buf.toString("base64")}`,
			type: "image_url"
		};
	} catch {}
	throw new Error(`Could not load reference image ${src}`);
}
function extractImageUrl(body) {
	const rec = body;
	const first = rec.data?.[0];
	if (first?.url) return first.url;
	if (rec.url) return rec.url;
	if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;
	throw new Error("Imagine returned no image");
}
async function chatJson(system, user) {
	const key = requireKey();
	const res = await fetch(`${XAI}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .4,
			max_tokens: 3500,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`xAI chat error ${res.status}: ${text.slice(0, 240)}`);
	}
	const cleaned = ((await res.json()).choices[0]?.message.content ?? "{}").replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
	return JSON.parse(cleaned);
}
async function generatePortrait(appearance) {
	const key = requireKey();
	const res = await fetch(`${XAI}/images/generations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify({
			model: "grok-imagine-image-2.0",
			prompt: portraitPrompt(appearance),
			n: 1,
			aspect_ratio: "2:3",
			resolution: "1K"
		})
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Portrait error ${res.status}: ${text.slice(0, 240)}`);
	}
	return extractImageUrl(await res.json());
}
async function generateScene(beat, appearances, refs) {
	const key = requireKey();
	const prompt = scenePrompt(beat, appearances);
	const images = await Promise.all(refs.slice(0, 3).map(toImageInput));
	if (images.length > 0) {
		const res = await fetch(`${XAI}/images/edits`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${key}`
			},
			body: JSON.stringify({
				model: "grok-imagine-image-2.0",
				prompt,
				...images.length === 1 ? { image: images[0] } : { images },
				aspect_ratio: "16:9",
				resolution: "1K"
			})
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
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify({
			model: "grok-imagine-image-2.0",
			prompt,
			n: 1,
			aspect_ratio: "16:9",
			resolution: "1K"
		})
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Scene error ${res.status}: ${text.slice(0, 240)}`);
	}
	return extractImageUrl(await res.json());
}
async function startVideo(imageSrc, prompt) {
	const key = requireKey();
	const image = await toImageInput(imageSrc);
	const res = await fetch(`${XAI}/videos/generations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify({
			model: "grok-imagine-video-1.5",
			prompt,
			image: { url: image.url },
			duration: 6
		})
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Video start error ${res.status}: ${text.slice(0, 240)}`);
	}
	const body = await res.json();
	const id = body.request_id ?? body.id;
	if (!id) throw new Error("Video start returned no request id");
	return id;
}
async function pollVideo(requestId) {
	const key = requireKey();
	const res = await fetch(`${XAI}/videos/${requestId}`, { headers: { Authorization: `Bearer ${key}` } });
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Video poll error ${res.status}: ${text.slice(0, 240)}`);
	}
	const body = await res.json();
	return {
		status: body.status ?? "unknown",
		url: body.video?.url ?? body.url
	};
}
async function transcribeAudio(file, keyterms) {
	const key = requireKey();
	const form = new FormData();
	form.append("format", "true");
	form.append("language", "en");
	form.append("diarize", "true");
	for (const term of keyterms.slice(0, 40)) if (term.trim()) form.append("keyterm", term.trim().slice(0, 50));
	form.append("file", file, file.name || "session.webm");
	const res = await fetch(`${XAI}/stt`, {
		method: "POST",
		headers: { Authorization: `Bearer ${key}` },
		body: form
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Transcription error ${res.status}: ${text.slice(0, 240)}`);
	}
	const body = await res.json();
	const text = (body.text ?? "").trim();
	if (!text) throw new Error("The recording produced an empty transcript");
	return {
		text,
		duration: body.duration ?? 0
	};
}
//#endregion
export { __exportAll as i, transcribeAudio as n, xai_exports as r, chatJson as t };
