import type { LocationKind } from "./types";

export const LOCATION_KINDS: LocationKind[] = [
  "settlement",
  "interior",
  "dungeon",
  "wilderness",
  "landmark",
];

export function kindLabel(kind: LocationKind) {
  return kind === "settlement"
    ? "Settlement"
    : kind === "interior"
      ? "Interior"
      : kind === "dungeon"
        ? "Dungeon"
        : kind === "wilderness"
          ? "Wilderness"
          : "Landmark";
}
