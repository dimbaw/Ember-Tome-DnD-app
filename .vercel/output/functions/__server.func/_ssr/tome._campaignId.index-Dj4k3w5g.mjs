import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useTome } from "./store-Bo6EXT8E.mjs";
import { t as Button } from "./button-Db7VdWlM.mjs";
import { t as formatPlayed } from "./ids-Dm96HNaF.mjs";
import { c as Mic } from "../_libs/lucide-react.mjs";
import { o as Route$5 } from "./router-BmawLhnN.mjs";
import { t as Portrait } from "./portrait-DIhBIVfC.mjs";
import { t as SceneFrame } from "./scene-frame-DBG1IYN1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tome._campaignId.index-Dj4k3w5g.js
var import_jsx_runtime = require_jsx_runtime();
function Chronicle() {
	const { campaignId } = Route$5.useParams();
	const campaign = useTome((s) => s.campaigns.find((c) => c.id === campaignId));
	const allSessions = useTome((s) => s.sessions);
	const allScenes = useTome((s) => s.scenes);
	const allCharacters = useTome((s) => s.characters);
	const sessions = allSessions.filter((x) => x.campaignId === campaignId).sort((a, b) => a.number - b.number);
	const scenes = allScenes.filter((x) => x.campaignId === campaignId);
	const characters = allCharacters.filter((c) => c.campaignId === campaignId);
	if (!campaign) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: campaign.world
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl leading-tight sm:text-5xl",
					children: campaign.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-prose text-base leading-relaxed text-muted",
					children: campaign.premise
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-3 lg:justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/tome/$campaignId/record",
						params: { campaignId },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }), "Record a session"]
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-3 overflow-x-auto pb-2",
				children: characters.filter((c) => c.kind === "pc").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/tome/$campaignId/party/$characterId",
					params: {
						campaignId,
						characterId: c.id
					},
					className: "w-28 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-portrait overflow-hidden rounded-lg",
							children: c.portraitUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
								character: c,
								sizes: "112px"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-elevated" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 truncate font-display text-sm",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-subtle",
							children: c.classOrRole
						})
					]
				}, c.id))
			})
		}),
		sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChronicle, { campaignId }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid gap-20",
			children: sessions.map((session) => {
				const sessionScenes = scenes.filter((s) => s.sessionId === session.id);
				const involved = characters.filter((c) => session.characterIds.includes(c.id));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs tracking-[0.18em] text-subtle uppercase",
								children: [
									"Session ",
									String(session.number).padStart(2, "0"),
									" · ",
									formatPlayed(session.playedOn)
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-display text-3xl",
								children: session.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/tome/$campaignId/session/$sessionId",
								params: {
									campaignId,
									sessionId: session.id
								},
								className: "text-sm text-muted hover:text-fg",
								children: "Open the night"
							})]
						}),
						sessionScenes[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneFrame, {
							scene: sessionScenes[0],
							eager: session.number === 1
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-prose text-base leading-relaxed text-muted",
							children: session.summary
						}),
						sessionScenes.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: sessionScenes.slice(1).map((scene) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneFrame, { scene }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-base",
								children: scene.title
							})] }, scene.id))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
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
						})
					]
				}, session.id);
			})
		})
	] });
}
function EmptyChronicle({ campaignId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-16 max-w-lg rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "The pages are still blank"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Record the next night at the table, or paste the session notes. Faces that already live in this tome will be drawn the same way again."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tome/$campaignId/record",
					params: { campaignId },
					children: "Record a session"
				})
			})
		]
	});
}
//#endregion
export { Chronicle as component };
