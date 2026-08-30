import { beginVideo, checkVideo } from "./fns";

export async function waitForVideo(imageSrc: string, prompt: string) {
  const started = await beginVideo({ data: { imageSrc, prompt } });
  if (!started.ok) throw new Error(started.error);
  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 4000));
    const poll = await checkVideo({ data: { requestId: started.requestId } });
    if (!poll.ok) throw new Error(poll.error);
    if (poll.status === "done" && poll.url) return poll.url;
    if (poll.status === "failed" || poll.status === "expired") {
      throw new Error("The animation did not complete.");
    }
  }
  throw new Error("Timed out waiting for the animation.");
}
