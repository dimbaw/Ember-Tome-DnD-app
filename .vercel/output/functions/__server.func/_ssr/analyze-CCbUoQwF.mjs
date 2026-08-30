import { t as chatJson } from "./xai-Bwb6QFJj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-CCbUoQwF.js
async function analyzeSession(input) {
	const roster = input.existingCharacters.length === 0 ? "None yet — extract the table from the recording." : input.existingCharacters.map((c) => `- id=${c.id} | ${c.name} (${c.kind}, ${c.race} ${c.classOrRole}) appearance: ${c.appearance}`).join("\n");
	const system = `You are the chronicler of a tabletop Dungeons & Dragons campaign.
Read a session transcript (or notes) and return a careful JSON chronicle.

Rules:
- Prefer matching existing characters by name (ignore minor spelling drift). Set matchedExistingId to their id.
- For genuinely new characters, matchedExistingId is null. Invent a locked visual appearance (face, hair, age, clothing, distinctive marks) that an illustrator can reuse forever. No purple neon. Earth, soot, iron, bone, firelight.
- PCs are the players' characters. NPCs are everyone else.
- summary: 2–4 grounded paragraphs, past tense, no game-mechanics jargon unless it was spoken at the table. No emoji.
- events: 4–8 concrete things that happened, each tied to characters.
- scenes: 2 or 3 illustratable moments (not more). Each beat is one cinematic image. Title like a chapter heading.
- appearance must stay consistent with any matched existing character — copy their appearance field, do not restyle them.
- If a date is mentioned, ISO date in playedOn, else null.
- Return JSON only, matching the schema.`;
	const user = `Campaign: ${input.campaignName}
World: ${input.world}

Existing roster:
${roster}

Session transcript / notes:
"""
${input.transcript.slice(0, 24e3)}
"""

Return JSON:
{
  "title": string,
  "summary": string,
  "playedOn": string | null,
  "characters": [{ "name", "kind": "pc"|"npc", "race", "classOrRole", "appearance", "status": "alive"|"dead"|"unknown", "whatHappened", "matchedExistingId": string|null }],
  "events": [{ "text", "characterNames": string[] }],
  "scenes": [{ "title", "beat", "kind": "moment"|"encounter"|"travel"|"roleplay", "characterNames": string[] }]
}`;
	const raw = await chatJson(system, user);
	const characters = Array.isArray(raw.characters) ? raw.characters.slice(0, 8) : [];
	const events = Array.isArray(raw.events) ? raw.events.slice(0, 10) : [];
	const scenes = Array.isArray(raw.scenes) ? raw.scenes.slice(0, 3) : [];
	return {
		title: (raw.title || "Untitled session").trim(),
		summary: (raw.summary || "").trim(),
		playedOn: raw.playedOn || null,
		characters: characters.map((c) => ({
			name: String(c.name ?? "Unknown").trim(),
			kind: c.kind === "npc" ? "npc" : "pc",
			race: String(c.race ?? "Unknown").trim(),
			classOrRole: String(c.classOrRole ?? "").trim(),
			appearance: String(c.appearance ?? "").trim(),
			status: c.status === "dead" || c.status === "unknown" ? c.status : "alive",
			whatHappened: String(c.whatHappened ?? "").trim(),
			matchedExistingId: c.matchedExistingId ? String(c.matchedExistingId) : null
		})),
		events: events.map((e) => ({
			text: String(e.text ?? "").trim(),
			characterNames: Array.isArray(e.characterNames) ? e.characterNames.map(String) : []
		})),
		scenes: scenes.map((s) => ({
			title: String(s.title ?? "A moment").trim(),
			beat: String(s.beat ?? "").trim(),
			kind: s.kind === "encounter" || s.kind === "travel" || s.kind === "roleplay" ? s.kind : "moment",
			characterNames: Array.isArray(s.characterNames) ? s.characterNames.map(String) : []
		}))
	};
}
//#endregion
export { analyzeSession };
