import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useTome } from "./store-Bo6EXT8E.mjs";
import { t as Button } from "./button-Db7VdWlM.mjs";
import { t as formatPlayed } from "./ids-Dm96HNaF.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as Film } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-BmawLhnN.mjs";
import { t as Portrait } from "./portrait-DIhBIVfC.mjs";
import { t as SceneFrame } from "./scene-frame-DBG1IYN1.mjs";
import { n as beginVideo, r as checkVideo } from "./fns-D_-FsGjV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tome._campaignId.session._sessionId-DPx9EEyL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SessionPage() {
	const { campaignId, sessionId } = Route.useParams();
	const session = useTome((s) => s.sessions.find((x) => x.id === sessionId));
	const allScenes = useTome((s) => s.scenes);
	const allCharacters = useTome((s) => s.characters);
	const scenes = allScenes.filter((x) => x.sessionId === sessionId);
	const characters = allCharacters.filter((c) => c.campaignId === campaignId);
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "This night is not bound."
	});
	const involved = characters.filter((c) => session.characterIds.includes(c.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs tracking-[0.18em] text-subtle uppercase",
			children: [
				"Session ",
				String(session.number).padStart(2, "0"),
				" · ",
				formatPlayed(session.playedOn)
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl sm:text-5xl",
			children: session.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-5 max-w-prose text-base leading-relaxed text-muted",
			children: session.summary
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex flex-wrap gap-2",
			children: involved.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/tome/$campaignId/party/$characterId",
				params: {
					campaignId,
					characterId: c.id
				},
				className: "flex items-center gap-2 rounded-full bg-elevated py-1 pr-3 pl-1 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-6 overflow-hidden rounded-full",
					children: c.portraitUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
						character: c,
						sizes: "24px"
					}) : null
				}), c.name]
			}, c.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-10",
			children: scenes.map((scene) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneFrame, { scene }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: scene.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-prose text-sm leading-relaxed text-muted",
						children: scene.beat
					}),
					!scene.videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateScene, { sceneId: scene.id }) : null
				] })]
			}, scene.id))
		}),
		session.events.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12 max-w-prose",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "What the table did"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 grid gap-3",
				children: session.events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm leading-relaxed text-muted",
					children: event.text
				}, event.id))
			})]
		}) : null
	] });
}
function AnimateScene({ sceneId }) {
	const scene = useTome((s) => s.scenes.find((x) => x.id === sceneId));
	const updateScene = useTome((s) => s.updateScene);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!scene) return null;
	async function animate() {
		const current = useTome.getState().scenes.find((x) => x.id === sceneId);
		if (!current) return;
		setBusy(true);
		try {
			const started = await beginVideo({ data: {
				imageSrc: current.imageUrl,
				prompt: `${current.beat} Slow cinematic camera, firelight and wind, keep the characters still enough to stay recognizable.`
			} });
			if (!started.ok) throw new Error(started.error);
			const deadline = Date.now() + 18e4;
			while (Date.now() < deadline) {
				await new Promise((r) => setTimeout(r, 4e3));
				const poll = await checkVideo({ data: { requestId: started.requestId } });
				if (!poll.ok) throw new Error(poll.error);
				if (poll.status === "done" && poll.url) {
					updateScene(sceneId, { videoUrl: poll.url });
					toast.success("The moment is moving.");
					return;
				}
				if (poll.status === "failed" || poll.status === "expired") throw new Error("The animation did not complete.");
			}
			throw new Error("Timed out waiting for the animation.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not animate this scene");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size: "sm",
		className: "mt-3",
		onClick: animate,
		disabled: busy,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "size-4" }), busy ? "Animating this moment…" : "Animate this moment"]
	});
}
//#endregion
export { SessionPage as component };
