import { formatBytes, MAX_AUDIO_BYTES, MAX_DOC_BYTES, MAX_IMAGE_SOURCE_BYTES } from "./limits";

export type SourceKind = "audio" | "image" | "text" | "document";

export function sourceKind(file: File): SourceKind {
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  if (type.startsWith("audio/") || /\.(webm|mp3|wav|m4a|ogg|opus|flac|aac)$/.test(name)) {
    return "audio";
  }
  if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|tif{1,2})$/.test(name)) {
    return "image";
  }
  if (
    type.startsWith("text/") ||
    type === "application/json" ||
    type === "application/xml" ||
    /\.(txt|md|markdown|csv|json|html|htm|xml|rtf)$/.test(name)
  ) {
    return "text";
  }
  return "document";
}

export function maxBytesFor(kind: SourceKind) {
  if (kind === "audio") return MAX_AUDIO_BYTES;
  if (kind === "image") return MAX_IMAGE_SOURCE_BYTES;
  return MAX_DOC_BYTES;
}

export function assertSourceSize(file: File) {
  const kind = sourceKind(file);
  const max = maxBytesFor(kind);
  if (file.size > max) {
    throw new Error(
      `${file.name} is ${formatBytes(file.size)}. That kind of file can be up to ${formatBytes(max)}.`,
    );
  }
}

export function kindLabel(kind: SourceKind) {
  return kind === "audio"
    ? "Audio"
    : kind === "image"
      ? "Picture"
      : kind === "text"
        ? "Text"
        : "Document";
}
