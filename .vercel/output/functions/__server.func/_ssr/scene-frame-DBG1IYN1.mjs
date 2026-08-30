import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal$1, i as DialogOverlay$1, n as DialogClose, o as DialogTitle$1, r as DialogContent$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as cn } from "./store-Bo6EXT8E.mjs";
import { s as Play, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scene-frame-DBG1IYN1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-bg/80", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(96vw,1100px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-2 shadow-[var(--shadow-border)] focus:outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 flex size-11 items-center justify-center rounded-lg bg-bg/60 text-fg hover:bg-bg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-lg text-fg", className),
		...props
	});
}
function SceneFrame({ scene, className, eager }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const hasVideo = Boolean(scene.videoUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: cn("group relative block w-full overflow-hidden rounded-xl text-left", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: scene.imageUrl,
			alt: scene.title,
			loading: eager ? "eager" : "lazy",
			className: "aspect-video w-full object-cover transition-transform duration-500 ease-[var(--ease-out-smooth)] group-hover:scale-[1.02]"
		}), hasVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-bg/70 text-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 translate-x-px" })
		}) : null]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: scene.title
			}),
			hasVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: scene.videoUrl,
				poster: scene.imageUrl,
				controls: true,
				autoPlay: true,
				playsInline: true,
				className: "aspect-video w-full rounded-lg object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: scene.imageUrl,
				alt: scene.title,
				className: "aspect-video w-full rounded-lg object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 pt-2 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg text-fg",
					children: scene.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-muted",
					children: scene.beat
				})]
			})
		] })
	})] });
}
//#endregion
export { SceneFrame as t };
