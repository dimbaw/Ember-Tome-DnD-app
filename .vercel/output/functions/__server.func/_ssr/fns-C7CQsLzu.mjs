import { n as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-C7CQsLzu.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var aiAvailable_createServerFn_handler = createServerRpc({
	id: "3407d050248c8440995c0edee38b769631be091324d0c4f717d1864c591ba474",
	name: "aiAvailable",
	filename: "src/lib/ai/fns.ts"
}, (opts) => aiAvailable.__executeServer(opts));
var aiAvailable = createServerFn({ method: "GET" }).handler(aiAvailable_createServerFn_handler, async () => {
	const { apiKey } = await import("./xai-Bwb6QFJj.mjs").then((n) => n.r);
	return { ok: Boolean(apiKey()) };
});
var analyzeTranscript_createServerFn_handler = createServerRpc({
	id: "548a0170ca59a8f55e4b9bacf6801cb0445222b696d58cec605ee324d030d8fb",
	name: "analyzeTranscript",
	filename: "src/lib/ai/fns.ts"
}, (opts) => analyzeTranscript.__executeServer(opts));
var analyzeTranscript = createServerFn({ method: "POST" }).validator((data) => data).handler(analyzeTranscript_createServerFn_handler, async ({ data }) => {
	try {
		const { analyzeSession } = await import("./analyze-CCbUoQwF.mjs");
		return {
			ok: true,
			analysis: await analyzeSession(data)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Analysis failed"
		};
	}
});
var makePortrait_createServerFn_handler = createServerRpc({
	id: "9c1976646ab64fefcb6eaa94cc6c4abe8071d1cc5e83383a0bc39d5dddfeefbb",
	name: "makePortrait",
	filename: "src/lib/ai/fns.ts"
}, (opts) => makePortrait.__executeServer(opts));
var makePortrait = createServerFn({ method: "POST" }).validator((data) => data).handler(makePortrait_createServerFn_handler, async ({ data }) => {
	try {
		const { generatePortrait } = await import("./xai-Bwb6QFJj.mjs").then((n) => n.r);
		return {
			ok: true,
			url: await generatePortrait(data.appearance)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Portrait failed"
		};
	}
});
var makeScene_createServerFn_handler = createServerRpc({
	id: "a45f9d6f13d0f80944c5d2d5ce4baaea9ada2a273b884e9ee3b84113e8b2751a",
	name: "makeScene",
	filename: "src/lib/ai/fns.ts"
}, (opts) => makeScene.__executeServer(opts));
var makeScene = createServerFn({ method: "POST" }).validator((data) => data).handler(makeScene_createServerFn_handler, async ({ data }) => {
	try {
		const { generateScene } = await import("./xai-Bwb6QFJj.mjs").then((n) => n.r);
		return {
			ok: true,
			url: await generateScene(data.beat, data.appearances, data.refs)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Scene failed"
		};
	}
});
var beginVideo_createServerFn_handler = createServerRpc({
	id: "4bc345dd980f4a6a961ad87fce85c7f47abc56a42400d6df0d775241a05df1cd",
	name: "beginVideo",
	filename: "src/lib/ai/fns.ts"
}, (opts) => beginVideo.__executeServer(opts));
var beginVideo = createServerFn({ method: "POST" }).validator((data) => data).handler(beginVideo_createServerFn_handler, async ({ data }) => {
	try {
		const { startVideo } = await import("./xai-Bwb6QFJj.mjs").then((n) => n.r);
		return {
			ok: true,
			requestId: await startVideo(data.imageSrc, data.prompt)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Video failed to start"
		};
	}
});
var checkVideo_createServerFn_handler = createServerRpc({
	id: "7f628762c8a4c9c5de1180adf33d9ce2ff54746876e7f97f743dc3c979ecbc8b",
	name: "checkVideo",
	filename: "src/lib/ai/fns.ts"
}, (opts) => checkVideo.__executeServer(opts));
var checkVideo = createServerFn({ method: "POST" }).validator((data) => data).handler(checkVideo_createServerFn_handler, async ({ data }) => {
	try {
		const { pollVideo } = await import("./xai-Bwb6QFJj.mjs").then((n) => n.r);
		return {
			ok: true,
			...await pollVideo(data.requestId)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Video poll failed"
		};
	}
});
//#endregion
export { aiAvailable_createServerFn_handler, analyzeTranscript_createServerFn_handler, beginVideo_createServerFn_handler, checkVideo_createServerFn_handler, makePortrait_createServerFn_handler, makeScene_createServerFn_handler };
