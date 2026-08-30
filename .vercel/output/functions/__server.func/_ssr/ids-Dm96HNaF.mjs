//#region node_modules/.nitro/vite/services/ssr/assets/ids-Dm96HNaF.js
function nid(prefix) {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
function formatPlayed(iso) {
	const value = iso.length <= 10 ? `${iso}T12:00:00` : iso;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function matchCharacter(name, roster) {
	const n = name.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
	return roster.find((c) => c.id === name) || roster.find((c) => c.name.toLowerCase() === n) || roster.find((c) => n.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(n));
}
//#endregion
export { matchCharacter as n, nid as r, formatPlayed as t };
