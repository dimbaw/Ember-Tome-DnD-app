import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useTome } from "./store-Bo6EXT8E.mjs";
import { t as Button } from "./button-Db7VdWlM.mjs";
import { t as Wordmark } from "./wordmark-BGYxolna.mjs";
import { r as nid } from "./ids-Dm96HNaF.mjs";
import { t as Input } from "./input-DCTNbtIV.mjs";
import { t as Textarea } from "./textarea-BBc36vrp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-CvMJV5d7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewCampaign() {
	const navigate = useNavigate();
	const addCampaign = useTome((s) => s.addCampaign);
	const [name, setName] = (0, import_react.useState)("");
	const [world, setWorld] = (0, import_react.useState)("");
	const [premise, setPremise] = (0, import_react.useState)("");
	function onSubmit(e) {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("The campaign needs a name.");
			return;
		}
		const id = nid("camp");
		addCampaign({
			id,
			name: name.trim(),
			world: world.trim() || "Unnamed world",
			premise: premise.trim(),
			coverUrl: "/campaign/ashen-crown/cover.jpg",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		navigate({
			to: "/tome/$campaignId",
			params: { campaignId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex h-16 max-w-xl items-center justify-between px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: "Open a new tome"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl",
					children: "Begin a campaign"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted leading-relaxed",
					children: "Name the work. Add the party by hand, or let a recording discover them."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-8 grid gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Campaign"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "The Ashen Crown",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "World"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: world,
								onChange: (e) => setWorld(e.target.value),
								placeholder: "The Cinder Marches"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Premise"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: premise,
								onChange: (e) => setPremise(e.target.value),
								placeholder: "What the table is chasing, in a few sentences.",
								className: "min-h-32"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							children: "Open the tome"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { NewCampaign as component };
