import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useTome } from "./store-Bo6EXT8E.mjs";
import { t as Button } from "./button-Db7VdWlM.mjs";
import { t as Wordmark } from "./wordmark-BGYxolna.mjs";
import { t as formatPlayed } from "./ids-Dm96HNaF.mjs";
import { c as Mic, o as Plus, u as BookOpen } from "../_libs/lucide-react.mjs";
import { t as Portrait } from "./portrait-DIhBIVfC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Brwziff1.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const campaigns = useTome((s) => s.campaigns);
	const characters = useTome((s) => s.characters);
	const sessions = useTome((s) => s.sessions);
	const scenes = useTome((s) => s.scenes);
	const featured = campaigns[0];
	const party = featured ? characters.filter((c) => c.campaignId === featured.id && c.kind === "pc") : [];
	const featuredSessions = featured ? sessions.filter((s) => s.campaignId === featured.id).sort((a, b) => a.number - b.number) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "absolute inset-x-0 top-0 z-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/new",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New campaign"]
						})
					})]
				})
			}),
			featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-dvh",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: featured.coverUrl,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-end px-4 pb-24 pt-24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.22em] text-muted uppercase",
								children: featured.world
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 max-w-3xl font-display text-4xl leading-tight tracking-tight text-fg sm:text-5xl",
								children: featured.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base",
								children: featured.premise
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/tome/$campaignId",
										params: { campaignId: featured.id },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "Open the chronicle"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "outline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/tome/$campaignId/record",
										params: { campaignId: featured.id },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }), "Record a session"]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex -space-x-3",
									children: party.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-11 overflow-hidden rounded-full ring-2 ring-bg",
										title: c.name,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
											character: c,
											sizes: "44px"
										})
									}, c.id))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										party.length,
										" in the party · ",
										featuredSessions.length,
										" sessions bound"
									]
								})]
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHome, {}),
			featured && featuredSessions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: "Bound nights"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-4 sm:grid-cols-3",
					children: featuredSessions.map((session) => {
						const scene = scenes.find((s) => s.sessionId === session.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/tome/$campaignId/session/$sessionId",
							params: {
								campaignId: featured.id,
								sessionId: session.id
							},
							className: "group overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
							children: [scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: scene.imageUrl,
								alt: "",
								className: "aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-subtle",
									children: [
										"Session ",
										session.number,
										" · ",
										formatPlayed(session.playedOn)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-display text-xl text-fg",
									children: session.title
								})]
							})]
						}, session.id);
					})
				})]
			}) : null,
			campaigns.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 pb-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: "Other tomes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-3",
					children: campaigns.slice(1).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tome/$campaignId",
						params: { campaignId: c.id },
						className: "flex items-center justify-between rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: c.world
						})] })
					}, c.id))
				})]
			}) : null
		]
	});
}
function EmptyHome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "A table, remembered"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted leading-relaxed",
				children: "Record a session. Ember Tome listens, keeps the faces straight, and paints what happened so the campaign has somewhere to live after the dice stop."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-8",
				size: "lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/new",
					children: "Begin a campaign"
				})
			})
		]
	});
}
//#endregion
export { Home as component };
