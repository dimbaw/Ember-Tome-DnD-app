import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { nid } from "@/lib/ids";
import { useTome } from "@/lib/store";
import type { Session } from "@/lib/types";

export function SessionFields({ session }: { session: Session }) {
  const updateSession = useTome((s) => s.updateSession);
  const allCharacters = useTome((s) => s.characters);
  const characters = allCharacters.filter((c) => c.campaignId === session.campaignId);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Title</span>
          <Input
            value={session.title}
            onChange={(e) => updateSession(session.id, { title: e.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Played on</span>
          <Input
            type="date"
            value={session.playedOn.slice(0, 10)}
            onChange={(e) => updateSession(session.id, { playedOn: e.target.value })}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">What happened</span>
        <Textarea
          value={session.summary}
          onChange={(e) => updateSession(session.id, { summary: e.target.value })}
        />
      </label>
      <fieldset className="grid gap-2">
        <legend className="text-sm text-muted">Who sat this night</legend>
        <div className="flex flex-wrap gap-2">
          {characters.map((c) => {
            const on = session.characterIds.includes(c.id);
            return (
              <label
                key={c.id}
                className="flex h-11 items-center gap-2 rounded-lg bg-elevated px-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => {
                    const characterIds = on
                      ? session.characterIds.filter((id) => id !== c.id)
                      : [...session.characterIds, c.id];
                    updateSession(session.id, { characterIds });
                  }}
                />
                {c.name}
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-3">
        <p className="text-sm text-muted">Beats at the table</p>
        {session.events.map((event, index) => (
          <div key={event.id} className="flex gap-2">
            <Input
              value={event.text}
              onChange={(e) => {
                const events = session.events.map((x) =>
                  x.id === event.id ? { ...x, text: e.target.value } : x,
                );
                updateSession(session.id, { events });
              }}
              aria-label={`Beat ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() =>
                updateSession(session.id, {
                  events: session.events.filter((x) => x.id !== event.id),
                })
              }
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() =>
            updateSession(session.id, {
              events: [...session.events, { id: nid("ev"), text: "", characterIds: [] }],
            })
          }
        >
          Add a beat
        </Button>
      </div>
    </div>
  );
}
