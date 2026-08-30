import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wordmark } from "@/components/wordmark";
import { nid } from "@/lib/ids";
import { useTome } from "@/lib/store";

export const Route = createFileRoute("/new")({ component: NewCampaign });

function NewCampaign() {
  const navigate = useNavigate();
  const addCampaign = useTome((s) => s.addCampaign);
  const [name, setName] = useState("");
  const [world, setWorld] = useState("");
  const [premise, setPremise] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("The campaign needs a name.");
      return;
    }
    const id = nid("camp");
    addCampaign({
      id,
      name: name.trim(),
      world: world.trim() || "Unnamed world",
      premise: premise.trim(),
      coverUrl: "/campaign/ashen-crown/cover.jpg?v=3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    navigate({ to: "/tome/$campaignId", params: { campaignId: id } });
  }

  return (
    <div className="min-h-dvh bg-bg">
      <header className="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
        <Wordmark />
        <Button asChild variant="ghost" size="sm">
          <Link to="/">Back</Link>
        </Button>
      </header>
      <main className="mx-auto max-w-xl px-4 py-10">
        <p className="text-xs tracking-[0.22em] text-muted uppercase">Open a new tome</p>
        <h1 className="mt-3 font-display text-4xl">Begin a campaign</h1>
        <p className="mt-3 text-muted leading-relaxed">
          Name the work. Add the party by hand, or let a recording discover them.
        </p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Campaign</span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="The Ashen Crown"
              required
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">World</span>
            <Input
              value={world}
              onChange={(e) => setWorld(e.target.value)}
              placeholder="The Cinder Marches"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Premise</span>
            <Textarea
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              placeholder="What the table is chasing, in a few sentences."
              className="min-h-32"
            />
          </label>
          <Button type="submit" size="lg">
            Open the tome
          </Button>
        </form>
      </main>
    </div>
  );
}
