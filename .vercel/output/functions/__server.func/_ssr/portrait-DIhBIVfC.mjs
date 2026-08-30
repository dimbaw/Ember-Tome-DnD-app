import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./store-Bo6EXT8E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portrait-DIhBIVfC.js
var import_jsx_runtime = require_jsx_runtime();
function Portrait({ character, className, sizes = "160px" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: character.portraitUrl,
		alt: character.name,
		sizes,
		className: cn("h-full w-full object-cover object-top", className)
	});
}
//#endregion
export { Portrait as t };
