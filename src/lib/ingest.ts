import {
  analyzeTranscript,
  makeLocation,
  makePortrait,
  makeScene,
} from "@/lib/ai/fns";
import { nid, matchCharacter } from "@/lib/ids";
import { nextSessionNumber, useTome } from "@/lib/store";
import type { Character, Location, Scene, Session, SessionEvent } from "@/lib/types";

export type IngestStep =
  | "listening"
  | "gathering"
  | "reading"
  | "portraits"
  | "illustrating"
  | "mapping"
  | "binding";

export async function transcribeFile(file: File, keyterms: string[]) {
  const form = new FormData();
  form.append("file", file, file.name || "session.webm");
  for (const term of keyterms.slice(0, 40)) form.append("keyterm", term);
  const res = await fetch("/api/transcribe", { method: "POST", body: form });
  const body = (await res.json()) as { ok: boolean; text?: string; error?: string };
  if (!body.ok || !body.text) throw new Error(body.error || "Transcription failed");
  return body.text;
}

export async function extractSourceFile(file: File, keyterms: string[]) {
  const form = new FormData();
  form.append("file", file, file.name);
  for (const term of keyterms.slice(0, 40)) form.append("keyterm", term);
  const res = await fetch("/api/extract", { method: "POST", body: form });
  const body = (await res.json()) as { ok: boolean; text?: string; error?: string };
  if (!body.ok || !body.text) throw new Error(body.error || `Could not read ${file.name}`);
  return body.text;
}

export async function ingestSession(opts: {
  campaignId: string;
  transcript: string;
  onStep: (step: IngestStep, detail?: string) => void;
}) {
  const state = useTome.getState();
  const campaign = state.campaigns.find((c) => c.id === opts.campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const roster = state.characters.filter((c) => c.campaignId === opts.campaignId);
  const atlas = state.locations.filter((l) => l.campaignId === opts.campaignId);

  opts.onStep("reading");
  const analyzed = await analyzeTranscript({
    data: {
      transcript: opts.transcript,
      campaignName: campaign.name,
      world: campaign.world,
      existingCharacters: roster.map((c) => ({
        id: c.id,
        name: c.name,
        kind: c.kind,
        race: c.race,
        classOrRole: c.classOrRole,
        appearance: c.appearance,
      })),
      existingLocations: atlas.map((l) => ({
        id: l.id,
        name: l.name,
        kind: l.kind,
        description: l.description,
      })),
    },
  });
  if (!analyzed.ok) throw new Error(analyzed.error);

  const analysis = analyzed.analysis;
  const sessionId = nid("sess");
  const resolved: Character[] = [];

  opts.onStep("portraits");
  for (const incoming of analysis.characters) {
    const existing =
      (incoming.matchedExistingId &&
        roster.find((c) => c.id === incoming.matchedExistingId)) ||
      matchCharacter(incoming.name, roster) ||
      matchCharacter(incoming.name, resolved);

    if (existing) {
      const found = roster.find((c) => c.id === existing.id) ?? existing;
      if (incoming.whatHappened) {
        useTome.getState().updateCharacter(found.id, {
          notes: found.notes
            ? `${found.notes}\n\n${incoming.whatHappened}`
            : incoming.whatHappened,
          status: incoming.status,
        });
      }
      resolved.push({ ...found, status: incoming.status });
      continue;
    }

    let portraitUrl = "";
    if (incoming.appearance) {
      opts.onStep("portraits", incoming.name);
      const made = await makePortrait({ data: { appearance: incoming.appearance } });
      if (made.ok) portraitUrl = made.url;
    }

    const character: Character = {
      id: nid("char"),
      campaignId: opts.campaignId,
      name: incoming.name,
      kind: incoming.kind,
      race: incoming.race,
      classOrRole: incoming.classOrRole,
      appearance: incoming.appearance,
      portraitUrl,
      portraitHistory: portraitUrl
        ? [{ id: nid("media"), url: portraitUrl, createdAt: new Date().toISOString(), source: "ai" }]
        : [],
      gallery: [],
      notes: incoming.whatHappened,
      status: incoming.status,
      firstSeenSessionId: sessionId,
    };
    useTome.getState().addCharacter(character);
    roster.push(character);
    resolved.push(character);
  }

  const nameToId = (names: string[]) =>
    names
      .map((n) => matchCharacter(n, resolved)?.id)
      .filter((id): id is string => Boolean(id));

  const events: SessionEvent[] = analysis.events
    .filter((e) => e.text)
    .map((e) => ({
      id: nid("ev"),
      text: e.text,
      characterIds: nameToId(e.characterNames),
    }));

  const scenes: Scene[] = [];
  for (const [index, s] of analysis.scenes.entries()) {
    opts.onStep("illustrating", s.title || `Scene ${index + 1}`);
    const involved = nameToId(s.characterNames)
      .map((id) => resolved.find((c) => c.id === id))
      .filter((c): c is Character => Boolean(c));
    const refs = involved
      .filter((c) => c.portraitUrl)
      .slice(0, 3)
      .map((c) => c.portraitUrl);
    const appearances = involved.map((c) => `${c.name}: ${c.appearance}`);
    let imageUrl = "";
    const made = await makeScene({
      data: { beat: s.beat || s.title, appearances, refs },
    });
    if (made.ok) imageUrl = made.url;
    if (!imageUrl) continue;
    scenes.push({
      id: nid("scene"),
      campaignId: opts.campaignId,
      sessionId,
      title: s.title,
      beat: s.beat,
      kind: s.kind,
      imageUrl,
      imageHistory: [
        { id: nid("media"), url: imageUrl, createdAt: new Date().toISOString(), source: "ai" },
      ],
      videoHistory: [],
      characterIds: involved.map((c) => c.id),
    });
  }

  const resolvedPlaces: Location[] = [];
  opts.onStep("mapping");
  for (const incoming of analysis.locations ?? []) {
    const existing =
      (incoming.matchedExistingId &&
        atlas.find((l) => l.id === incoming.matchedExistingId)) ||
      matchCharacter(incoming.name, atlas) ||
      matchCharacter(incoming.name, resolvedPlaces);

    if (existing) {
      const found = atlas.find((l) => l.id === existing.id) ?? existing;
      const notes = incoming.whatTheDmSaid
        ? found.notes
          ? `${found.notes}\n\n${incoming.whatTheDmSaid}`
          : incoming.whatTheDmSaid
        : found.notes;
      useTome.getState().updateLocation(found.id, {
        notes,
        sessionIds: found.sessionIds.includes(sessionId)
          ? found.sessionIds
          : [...found.sessionIds, sessionId],
      });
      resolvedPlaces.push({
        ...found,
        notes,
        sessionIds: found.sessionIds.includes(sessionId)
          ? found.sessionIds
          : [...found.sessionIds, sessionId],
      });
      continue;
    }

    opts.onStep("mapping", incoming.name);
    let imageUrl = "";
    if (incoming.description || incoming.name) {
      const made = await makeLocation({
        data: {
          name: incoming.name,
          description: incoming.description || incoming.whatTheDmSaid,
        },
      });
      if (made.ok) imageUrl = made.url;
    }
    const place: Location = {
      id: nid("loc"),
      campaignId: opts.campaignId,
      name: incoming.name,
      kind: incoming.kind,
      description: incoming.description || incoming.whatTheDmSaid,
      notes: incoming.whatTheDmSaid,
      imageUrl,
      imageHistory: imageUrl
        ? [{ id: nid("media"), url: imageUrl, createdAt: new Date().toISOString(), source: "ai" }]
        : [],
      videoHistory: [],
      firstSeenSessionId: sessionId,
      sessionIds: [sessionId],
    };
    useTome.getState().addLocation(place);
    atlas.push(place);
    resolvedPlaces.push(place);
  }

  opts.onStep("binding");
  const session: Session = {
    id: sessionId,
    campaignId: opts.campaignId,
    number: nextSessionNumber(opts.campaignId),
    title: analysis.title,
    playedOn: analysis.playedOn || new Date().toISOString().slice(0, 10),
    summary: analysis.summary,
    transcript: opts.transcript.slice(0, 200000),
    events,
    characterIds: [...new Set(resolved.map((c) => c.id))],
    locationIds: resolvedPlaces.map((l) => l.id),
    status: "complete",
    createdAt: new Date().toISOString(),
  };

  useTome.getState().addSession(session, scenes);
  useTome.getState().updateCampaign(opts.campaignId, {
    coverUrl: scenes[0]?.imageUrl || campaign.coverUrl,
  });

  return { sessionId, campaignId: opts.campaignId };
}
