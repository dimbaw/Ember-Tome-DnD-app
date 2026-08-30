import { chatJson } from "./xai";

export type AnalyzedCharacter = {
  name: string;
  kind: "pc" | "npc";
  race: string;
  classOrRole: string;
  appearance: string;
  status: "alive" | "dead" | "unknown";
  whatHappened: string;
  matchedExistingId: string | null;
};

export type AnalyzedScene = {
  title: string;
  beat: string;
  kind: "moment" | "encounter" | "travel" | "roleplay";
  characterNames: string[];
};

export type AnalyzedLocation = {
  name: string;
  kind: "settlement" | "interior" | "dungeon" | "wilderness" | "landmark";
  description: string;
  whatTheDmSaid: string;
  matchedExistingId: string | null;
};

export type AnalyzedEvent = {
  text: string;
  characterNames: string[];
};

export type SessionAnalysis = {
  title: string;
  summary: string;
  playedOn: string | null;
  characters: AnalyzedCharacter[];
  events: AnalyzedEvent[];
  scenes: AnalyzedScene[];
  locations: AnalyzedLocation[];
};

type ExistingChar = {
  id: string;
  name: string;
  kind: string;
  race: string;
  classOrRole: string;
  appearance: string;
};

type ExistingLoc = {
  id: string;
  name: string;
  kind: string;
  description: string;
};

export async function analyzeSession(input: {
  transcript: string;
  campaignName: string;
  world: string;
  existingCharacters: ExistingChar[];
  existingLocations?: ExistingLoc[];
}): Promise<SessionAnalysis> {
  const roster =
    input.existingCharacters.length === 0
      ? "None yet — extract the table from the recording."
      : input.existingCharacters
          .map(
            (c) =>
              `- id=${c.id} | ${c.name} (${c.kind}, ${c.race} ${c.classOrRole}) appearance: ${c.appearance}`,
          )
          .join("\n");

  const atlas =
    !input.existingLocations || input.existingLocations.length === 0
      ? "None yet — extract places the DM described."
      : input.existingLocations
          .map((l) => `- id=${l.id} | ${l.name} (${l.kind}) description: ${l.description}`)
          .join("\n");

  const system = `You are the chronicler of a tabletop Dungeons & Dragons campaign.
Read a session transcript, notes, character sheets, maps, handouts, or photographs of the table's papers and return a careful JSON chronicle.

Rules:
- Prefer matching existing characters by name (ignore minor spelling drift). Set matchedExistingId to their id.
- For genuinely new characters, matchedExistingId is null. Invent a locked visual appearance a Baldur's Gate 3 character artist can reuse: race, age (adults only), face, hair, scars, dirt, worn materials, one unforgettable detail. Combat may include blood and wounds. No neon, no anime, no modern fashion. If a sheet or portrait describes them, follow that.
- PCs are the players' characters. NPCs are everyone else.
- summary: 2–4 grounded paragraphs, past tense, no game-mechanics jargon unless it was spoken at the table. No emoji.
- events: 4–8 concrete things that happened, each tied to characters.
- scenes: 2 or 3 illustratable moments (not more). Each beat is one cinematic image. Title like a chapter heading.
- locations: extract places the Dungeon Master described, or that a map/handout shows — inns, rooms, roads, dungeons, landmarks, wilderness. 1–4 per session. Prefer matching existing places by name; copy their description, do not restyle. For new places, write a locked visual description an environment artist can reuse (architecture, light, weather, scale, one unforgettable detail).
- appearance must stay consistent with any matched existing character — copy their appearance field, do not restyle them.
- If a date is mentioned, ISO date in playedOn, else null.
- Return JSON only, matching the schema.`;

  const user = `Campaign: ${input.campaignName}
World: ${input.world}

Existing roster:
${roster}

Existing places:
${atlas}

Session transcript / notes:
"""
${input.transcript.slice(0, 180000)}
"""

Return JSON:
{
  "title": string,
  "summary": string,
  "playedOn": string | null,
  "characters": [{ "name", "kind": "pc"|"npc", "race", "classOrRole", "appearance", "status": "alive"|"dead"|"unknown", "whatHappened", "matchedExistingId": string|null }],
  "events": [{ "text", "characterNames": string[] }],
  "scenes": [{ "title", "beat", "kind": "moment"|"encounter"|"travel"|"roleplay", "characterNames": string[] }],
  "locations": [{ "name", "kind": "settlement"|"interior"|"dungeon"|"wilderness"|"landmark", "description", "whatTheDmSaid", "matchedExistingId": string|null }]
}`;

  const raw = await chatJson<Partial<SessionAnalysis>>(system, user);
  const characters = Array.isArray(raw.characters) ? raw.characters.slice(0, 8) : [];
  const events = Array.isArray(raw.events) ? raw.events.slice(0, 10) : [];
  const scenes = Array.isArray(raw.scenes) ? raw.scenes.slice(0, 3) : [];
  const locations = Array.isArray(raw.locations) ? raw.locations.slice(0, 4) : [];

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
      matchedExistingId: c.matchedExistingId ? String(c.matchedExistingId) : null,
    })),
    events: events.map((e) => ({
      text: String(e.text ?? "").trim(),
      characterNames: Array.isArray(e.characterNames)
        ? e.characterNames.map(String)
        : [],
    })),
    scenes: scenes.map((s) => ({
      title: String(s.title ?? "A moment").trim(),
      beat: String(s.beat ?? "").trim(),
      kind:
        s.kind === "encounter" || s.kind === "travel" || s.kind === "roleplay"
          ? s.kind
          : "moment",
      characterNames: Array.isArray(s.characterNames)
        ? s.characterNames.map(String)
        : [],
    })),
    locations: locations.map((l) => {
      const kind =
        l.kind === "settlement" ||
        l.kind === "interior" ||
        l.kind === "dungeon" ||
        l.kind === "wilderness" ||
        l.kind === "landmark"
          ? l.kind
          : "landmark";
      return {
        name: String(l.name ?? "Unknown place").trim(),
        kind,
        description: String(l.description ?? "").trim(),
        whatTheDmSaid: String(l.whatTheDmSaid ?? "").trim(),
        matchedExistingId: l.matchedExistingId ? String(l.matchedExistingId) : null,
      };
    }),
  };
}
