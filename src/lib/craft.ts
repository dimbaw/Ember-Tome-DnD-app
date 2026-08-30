import { withDirection, videoPrompt } from "./art";
import { waitForVideo } from "./ai/wait-video";

export async function animateStill(imageUrl: string, beat: string, instruction?: string) {
  if (!imageUrl) throw new Error("Paint the still first.");
  return waitForVideo(imageUrl, videoPrompt(withDirection(beat, instruction)));
}
