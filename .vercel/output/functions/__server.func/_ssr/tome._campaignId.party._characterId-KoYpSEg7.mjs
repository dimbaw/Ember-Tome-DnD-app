import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useTome, n as cn } from "./store-Bo6EXT8E.mjs";
import { t as formatPlayed } from "./ids-Dm96HNaF.mjs";
import { r as Route$1 } from "./router-BmawLhnN.mjs";
import { t as Portrait } from "./portrait-DIhBIVfC.mjs";
import { t as SceneFrame } from "./scene-frame-DBG1IYN1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tome._campaignId.party._characterId-KoYpSEg7.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full bg-elevated px-2.5 py-1 text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
function CharacterPage() {
	const { campaignId, characterId } = Route$1.useParams();
	const character = useTome((s) => s.characters.find((c) => c.id === characterId));
	const allSessions = useTome((s) => s.sessions);
	const allScenes = useTome((s) => s.scenes);
	const sessions = allSessions.filter((x) => x.campaignId === campaignId).sort((a, b) => a.number - b.number);
	const scenes = allScenes.filter((x) => x.campaignId === campaignId && x.characterIds.includes(characterId));
	if (!character) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "This face is not in the tome."
	});
	const timeline = sessions.flatMap((session) => session.events.filter((e) => e.characterIds.includes(characterId)).map((event) => ({
		session,
		event
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "grid gap-10 lg:grid-cols-[280px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-portrait overflow-hidden rounded-xl bg-elevated",
			children: character.portraitUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
				character,
				sizes: "280px"
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: character.kind === "pc" ? "Party" : "World" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: character.status })]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tracking-[0.18em] text-subtle uppercase",
				children: [
					character.race,
					" · ",
					character.classOrRole
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: character.name
			}),
			character.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-prose whitespace-pre-line text-base leading-relaxed text-muted",
				children: character.notes
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Locked appearance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-prose text-sm leading-relaxed text-muted",
					children: character.appearance
				})]
			}),
			timeline.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "What happened"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 grid gap-4",
					children: timeline.map(({ session, event }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-l border-border pl-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/tome/$campaignId/session/$sessionId",
							params: {
								campaignId,
								sessionId: session.id
							},
							className: "text-xs text-subtle hover:text-fg",
							children: [
								"Session ",
								session.number,
								" · ",
								session.title,
								" · ",
								formatPlayed(session.playedOn)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-fg",
							children: event.text
						})]
					}, event.id))
				})]
			}) : null,
			scenes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "In the pictures"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: scenes.map((scene) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneFrame, { scene }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display",
						children: scene.title
					})] }, scene.id))
				})]
			}) : null
		] })]
	});
}
//#endregion
export { CharacterPage as component };
