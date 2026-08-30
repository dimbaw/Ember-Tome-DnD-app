export const ART_BIBLE =
  "Cinematic Baldur's Gate 3 art style, Larian Studios in-engine cinematic: photoreal high-fidelity 3D, subsurface skin, individual hair strands, worn leather and scratched plate, volumetric god-rays, dramatic rim light, teal-and-ember color grade, shallow depth of field. Mature 18+ fantasy is allowed — blood, wounds, dirt, grim combat, adult themes. Adult characters only. Original characters, not existing video-game companions. No painterly D&D book plate, no anime, no cartoon, no neon, no modern fashion, no text, no watermark, no picture frame.";

export function portraitPrompt(appearance: string) {
  return `Baldur's Gate 3 character-creation portrait, close three-quarter bust, cinematic lighting. ${appearance} ${ART_BIBLE}`;
}

export function scenePrompt(beat: string, appearances: string[]) {
  const people =
    appearances.length > 0
      ? `Include these exact characters, matching their faces and costumes: ${appearances.join(" | ")}.`
      : "";
  return `Baldur's Gate 3 in-engine cinematic still, wide 16:9 cutscene frame. ${beat} ${people} ${ART_BIBLE}`;
}

export function locationPrompt(name: string, description: string) {
  return `Baldur's Gate 3 in-engine environment still, wide establishing shot of a place called "${name}". Paint the location as a Dungeon Master described it, not a character portrait. Do not invent named party members. ${description} ${ART_BIBLE}`;
}

export function videoPrompt(beat: string) {
  return `${beat} Baldur's Gate 3 cinematic cutscene: Larian in-engine camera push, hair and cloth physics, torch flicker, volumetric dust, keep faces and costumes locked. Mature fantasy motion is allowed.`;
}

export function withDirection(base: string, instruction?: string) {
  const extra = instruction?.trim();
  if (!extra) return base;
  return `${base} Follow this additional direction: ${extra}`;
}
