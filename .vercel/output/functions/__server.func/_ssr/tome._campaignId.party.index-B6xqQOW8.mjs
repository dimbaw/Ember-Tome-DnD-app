import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useTome } from "./store-Bo6EXT8E.mjs";
import { t as Button } from "./button-Db7VdWlM.mjs";
import { r as nid } from "./ids-Dm96HNaF.mjs";
import { t as Input } from "./input-DCTNbtIV.mjs";
import { t as Textarea } from "./textarea-BBc36vrp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$2 } from "./router-BmawLhnN.mjs";
import { t as Portrait } from "./portrait-DIhBIVfC.mjs";
import { i as makePortrait } from "./fns-D_-FsGjV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tome._campaignId.party.index-B6xqQOW8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Party() {
	const { campaignId } = Route$2.useParams();
	const characters = useTome((s) => s.characters).filter((c) => c.campaignId === campaignId);
	const pcs = characters.filter((c) => c.kind === "pc");
	const npcs = characters.filter((c) => c.kind === "npc");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.22em] text-muted uppercase",
				children: "The table"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Party and faces"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-prose text-muted",
				children: "Portraits stay locked. New nights are drawn from these faces, not invented again."
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "The party",
			people: pcs,
			campaignId
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Known in the world",
			people: npcs,
			campaignId
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddCharacter, { campaignId })
	] });
}
function Section({ title, people, campaignId }) {
	if (people.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
			children: people.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/tome/$campaignId/party/$characterId",
				params: {
					campaignId,
					characterId: c.id
				},
				className: "group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-portrait overflow-hidden rounded-xl bg-elevated",
						children: c.portraitUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
							character: c,
							sizes: "280px"
						}) : null
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-lg leading-tight",
						children: c.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							c.race,
							" ",
							c.classOrRole
						]
					})
				]
			}, c.id))
		})]
	});
}
function AddCharacter({ campaignId }) {
	const navigate = useNavigate();
	const addCharacter = useTome((s) => s.addCharacter);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [race, setRace] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("");
	const [appearance, setAppearance] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("pc");
	async function onSubmit(e) {
		e.preventDefault();
		if (!name.trim() || !appearance.trim()) {
			toast.error("Name and appearance are required so the face can stay consistent.");
			return;
		}
		setBusy(true);
		let portraitUrl = "";
		const made = await makePortrait({ data: { appearance: appearance.trim() } });
		if (made.ok) portraitUrl = made.url;
		else toast.error(made.error);
		const id = nid("char");
		addCharacter({
			id,
			campaignId,
			name: name.trim(),
			kind,
			race: race.trim() || "Unknown",
			classOrRole: role.trim(),
			appearance: appearance.trim(),
			portraitUrl,
			notes: "",
			status: "alive",
			firstSeenSessionId: null
		});
		navigate({
			to: "/tome/$campaignId/party/$characterId",
			params: {
				campaignId,
				characterId: id
			}
		});
	}
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "outline",
		className: "mt-12",
		onClick: () => setOpen(true),
		children: "Add a face to the tome"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "mt-12 max-w-xl rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Add a face"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Describe how they look once. Later illustrations will keep that face."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Race"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: race,
								onChange: (e) => setRace(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Class or role"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: role,
								onChange: (e) => setRole(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "flex gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 rounded-lg bg-elevated px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "kind",
								checked: kind === "pc",
								onChange: () => setKind("pc")
							}), "Player character"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 rounded-lg bg-elevated px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "kind",
								checked: kind === "npc",
								onChange: () => setKind("npc")
							}), "NPC"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Locked appearance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: appearance,
							onChange: (e) => setAppearance(e.target.value),
							placeholder: "Age, face, hair, scars, clothes, the one detail a painter should never lose.",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Painting the portrait…" : "Paint this face"
					})
				]
			})
		]
	});
}
//#endregion
export { Party as component };
