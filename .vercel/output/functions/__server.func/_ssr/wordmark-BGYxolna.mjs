import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./store-Bo6EXT8E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wordmark-BGYxolna.js
var import_jsx_runtime = require_jsx_runtime();
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: cn("flex items-center gap-2.5 text-fg no-underline", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			className: "size-7",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "32",
					height: "32",
					rx: "7",
					fill: "currentColor",
					className: "text-elevated"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "8",
					y: "9",
					width: "16",
					height: "15",
					rx: "1.5",
					fill: "#161411"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "7",
					y: "9",
					width: "4",
					height: "15",
					rx: "1.2",
					fill: "#9c9286"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "11",
					y: "9.5",
					width: "1.4",
					height: "14",
					fill: "#ece6dc"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-lg tracking-tight",
			children: "Ember Tome"
		})]
	});
}
//#endregion
export { Wordmark as t };
