import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Portrait } from "@/components/portrait";
import { makePortrait } from "@/lib/ai/fns";
import { nid } from "@/lib/ids";
import { useTome } from "@/lib/store";
import type { Character, CharacterKind } from "@/lib/types";

export const Route = createFileRoute("/tome/$campaignId/party/")({
  component: Party,
});

function Party() {
  const { campaignId } = Route.useParams();
  const allCharacters = useTome((s) => s.characters);
  const characters = allCharacters.filter((c) => c.campaignId === campaignId);
  const pcs = characters.filter((c) => c.kind === "pc");
  const npcs = characters.filter((c) => c.kind === "npc");

  return (
    <div>
      <header>
        <p className="text-xs tracking-[0.22em] text-muted uppercase">The table</p>
        <h1 className="mt-2 font-display text-4xl">Party and faces</h1>
        <p className="mt-3 max-w-prose text-muted">
        Portraits stay locked unless you edit them. New nights are drawn from the current face and appearance.
        </p>
      </header>

      <Section title="The party" people={pcs} campaignId={campaignId} />
      <Section title="Known in the world" people={npcs} campaignId={campaignId} />
      <AddCharacter campaignId={campaignId} />
    </div>
  );
}

function Section({
  title,
  people,
  campaignId,
}: {
  title: string;
  people: Character[];
  campaignId: string;
}) {
  if (people.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {people.map((c) => (
          <Link
            key={c.id}
            to="/tome/$campaignId/party/$characterId"
            params={{ campaignId, characterId: c.id }}
            className="group"
          >
            <div className="aspect-portrait overflow-hidden rounded-xl bg-elevated">
              {c.portraitUrl ? <Portrait character={c} sizes="280px" /> : null}
            </div>
            <p className="mt-3 font-display text-lg leading-tight">{c.name}</p>
            <p className="text-sm text-muted">
              {c.race} {c.classOrRole}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AddCharacter({ campaignId }: { campaignId: string }) {
  const navigate = useNavigate();
  const addCharacter = useTome((s) => s.addCharacter);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [role, setRole] = useState("");
  const [appearance, setAppearance] = useState("");
  const [kind, setKind] = useState<CharacterKind>("pc");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !appearance.trim()) {
      toast.error("Name and appearance are required so the face can stay consistent.");
      return;
    }
    setBusy(true);
    let portraitUrl = "";
    const made = await makePortrait({ data: { appearance: appearance.trim() } });
    if (made.ok) portraitUrl = made.url;
    else toast.error(made.error);
    const id = nid("char");
    addCharacter({
      id,
      campaignId,
      name: name.trim(),
      kind,
      race: race.trim() || "Unknown",
      classOrRole: role.trim(),
      appearance: appearance.trim(),
      portraitUrl,
      portraitHistory: portraitUrl
        ? [{ id: nid("media"), url: portraitUrl, createdAt: new Date().toISOString(), source: "ai" }]
        : [],
      gallery: [],
      notes: "",
      status: "alive",
      firstSeenSessionId: null,
    });
    navigate({
      to: "/tome/$campaignId/party/$characterId",
      params: { campaignId, characterId: id },
    });
  }

  if (!open) {
    return (
      <Button variant="outline" className="mt-12" onClick={() => setOpen(true)}>
        Add a face to the tome
      </Button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-12 max-w-xl rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
    >
      <h2 className="font-display text-2xl">Add a face</h2>
      <p className="mt-2 text-sm text-muted">
        Describe how they look once. Later illustrations will keep that face.
      </p>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Name</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Race</span>
            <Input value={race} onChange={(e) => setRace(e.target.value)} />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Class or role</span>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </label>
        </div>
        <fieldset className="flex gap-3 text-sm">
          <label className="flex h-11 items-center gap-2 rounded-lg bg-elevated px-3">
            <input
              type="radio"
              name="kind"
              checked={kind === "pc"}
              onChange={() => setKind("pc")}
            />
            Player character
          </label>
          <label className="flex h-11 items-center gap-2 rounded-lg bg-elevated px-3">
            <input
              type="radio"
              name="kind"
              checked={kind === "npc"}
              onChange={() => setKind("npc")}
            />
            NPC
          </label>
        </fieldset>
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Locked appearance</span>
          <Textarea
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            placeholder="Age, face, hair, scars, clothes, the one detail a painter should never lose."
            required
          />
        </label>
        <Button type="submit" disabled={busy}>
          {busy ? "Painting the portrait…" : "Paint this face"}
        </Button>
      </div>
    </form>
  );
}
