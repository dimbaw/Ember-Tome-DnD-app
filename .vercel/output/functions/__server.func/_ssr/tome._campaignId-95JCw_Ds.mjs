import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useTome, n as cn } from "./store-Bo6EXT8E.mjs";
import { t as Wordmark } from "./wordmark-BGYxolna.mjs";
import { c as Mic, n as Users, u as BookOpen } from "../_libs/lucide-react.mjs";
import { s as Route$6 } from "./router-BmawLhnN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tome._campaignId-95JCw_Ds.js
var import_jsx_runtime = require_jsx_runtime();
function CampaignShell({ campaignId, campaignName, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const items = [
		{
			to: "/tome/$campaignId",
			label: "Chronicle",
			icon: BookOpen,
			match: (p) => p === `/tome/${campaignId}` || p.startsWith(`/tome/${campaignId}/session`)
		},
		{
			to: "/tome/$campaignId/party",
			label: "Party",
			icon: Users,
			match: (p) => p.startsWith(`/tome/${campaignId}/party`)
		},
		{
			to: "/tome/$campaignId/record",
			label: "Record",
			icon: Mic,
			match: (p) => p.startsWith(`/tome/${campaignId}/record`)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-subtle sm:inline",
								children: "/"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden truncate font-display text-base text-muted sm:inline",
								children: campaignName
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-1 md:flex",
						children: items.map((item) => {
							const active = item.match(pathname);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								params: { campaignId },
								className: cn("flex h-11 items-center gap-2 rounded-lg px-3 text-sm transition-colors", active ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
							}, item.label);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 pb-28 pt-8 md:pb-16",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3",
					children: items.map((item) => {
						const active = item.match(pathname);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							params: { campaignId },
							className: cn("flex h-14 flex-col items-center justify-center gap-1 text-xs", active ? "text-fg" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}, item.label);
					})
				})
			})
		]
	});
}
function CampaignLayout() {
	const { campaignId } = Route$6.useParams();
	const campaign = useTome((s) => s.campaigns.find((c) => c.id === campaignId));
	if (!campaign) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "This tome is not on the shelf"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-muted",
			children: "It may have been cleared from this browser."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignShell, {
		campaignId: campaign.id,
		campaignName: campaign.name,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { CampaignLayout as component };
