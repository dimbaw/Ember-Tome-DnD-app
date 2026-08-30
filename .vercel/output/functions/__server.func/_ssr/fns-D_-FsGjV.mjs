import { n as createServerFn, r as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-D_-FsGjV.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "GET" }).handler(createSsrRpc("3407d050248c8440995c0edee38b769631be091324d0c4f717d1864c591ba474"));
var analyzeTranscript = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("548a0170ca59a8f55e4b9bacf6801cb0445222b696d58cec605ee324d030d8fb"));
var makePortrait = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("9c1976646ab64fefcb6eaa94cc6c4abe8071d1cc5e83383a0bc39d5dddfeefbb"));
var makeScene = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a45f9d6f13d0f80944c5d2d5ce4baaea9ada2a273b884e9ee3b84113e8b2751a"));
var beginVideo = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("4bc345dd980f4a6a961ad87fce85c7f47abc56a42400d6df0d775241a05df1cd"));
var checkVideo = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("7f628762c8a4c9c5de1180adf33d9ce2ff54746876e7f97f743dc3c979ecbc8b"));
//#endregion
export { makeScene as a, makePortrait as i, beginVideo as n, checkVideo as r, analyzeTranscript as t };
