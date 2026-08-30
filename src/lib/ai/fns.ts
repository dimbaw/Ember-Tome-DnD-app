import { createServerFn } from "@tanstack/react-start";

export const aiAvailable = createServerFn({ method: "GET" }).handler(async () => {
  const { apiKey } = await import("./xai");
  return { ok: Boolean(apiKey()) };
});

export const analyzeTranscript = createServerFn({ method: "POST" })
  .validator(
    (data: {
      transcript: string;
      campaignName: string;
      world: string;
      existingCharacters: {
        id: string;
        name: string;
        kind: string;
        race: string;
        classOrRole: string;
        appearance: string;
      }[];
      existingLocations: {
        id: string;
        name: string;
        kind: string;
        description: string;
      }[];
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const { analyzeSession } = await import("./analyze");
      const analysis = await analyzeSession(data);
      return { ok: true as const, analysis };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Analysis failed",
      };
    }
  });

export const makePortrait = createServerFn({ method: "POST" })
  .validator((data: { appearance: string; ref?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { generatePortrait } = await import("./xai");
      const url = await generatePortrait(data.appearance, data.ref);
      return { ok: true as const, url };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Portrait failed",
      };
    }
  });

export const makeScene = createServerFn({ method: "POST" })
  .validator((data: { beat: string; appearances: string[]; refs: string[] }) => data)
  .handler(async ({ data }) => {
    try {
      const { generateScene } = await import("./xai");
      const url = await generateScene(data.beat, data.appearances, data.refs);
      return { ok: true as const, url };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Scene failed",
      };
    }
  });

export const makeLocation = createServerFn({ method: "POST" })
  .validator((data: { name: string; description: string; ref?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { generateLocation } = await import("./xai");
      const url = await generateLocation(data.name, data.description, data.ref);
      return { ok: true as const, url };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Place failed",
      };
    }
  });

export const beginVideo = createServerFn({ method: "POST" })
  .validator((data: { imageSrc: string; prompt: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { startVideo } = await import("./xai");
      const requestId = await startVideo(data.imageSrc, data.prompt);
      return { ok: true as const, requestId };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Video failed to start",
      };
    }
  });

export const checkVideo = createServerFn({ method: "POST" })
  .validator((data: { requestId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { pollVideo } = await import("./xai");
      const result = await pollVideo(data.requestId);
      return { ok: true as const, ...result };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Video poll failed",
      };
    }
  });
