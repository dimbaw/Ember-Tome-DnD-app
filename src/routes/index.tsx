import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Mic, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { Portrait } from "@/components/portrait";
import { useTome } from "@/lib/store";
import { formatPlayed } from "@/lib/ids";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const campaigns = useTome((s) => s.campaigns);
  const characters = useTome((s) => s.characters);
  const sessions = useTome((s) => s.sessions);
  const scenes = useTome((s) => s.scenes);
  const featured = campaigns[0];
  const party = featured
    ? characters.filter((c) => c.campaignId === featured.id && c.kind === "pc")
    : [];
  const featuredSessions = featured
    ? sessions.filter((s) => s.campaignId === featured.id).sort((a, b) => a.number - b.number)
    : [];

  return (
    <div className="min-h-dvh bg-bg">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Wordmark />
          <Button asChild variant="outline" size="sm">
            <Link to="/new">
              <Plus className="size-4" />
              New campaign
            </Link>
          </Button>
        </div>
      </header>

      {featured ? (
        <section className="relative min-h-dvh">
          <img
            src={featured.coverUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
          <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-end px-4 pb-24 pt-24">
            <p className="text-xs tracking-[0.22em] text-muted uppercase">
              {featured.world}
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl leading-tight tracking-tight text-fg sm:text-5xl">
              {featured.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {featured.premise}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/tome/$campaignId" params={{ campaignId: featured.id }}>
                  <BookOpen className="size-4" />
                  Open the chronicle
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/tome/$campaignId/record" params={{ campaignId: featured.id }}>
                  <Mic className="size-4" />
                  Record a session
                </Link>
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3">
                {party.map((c) => (
                  <div
                    key={c.id}
                    className="size-11 overflow-hidden rounded-full ring-2 ring-bg"
                    title={c.name}
                  >
                    <Portrait character={c} sizes="44px" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                {party.length} in the party · {featuredSessions.length} sessions bound
              </p>
            </div>
          </div>
        </section>
      ) : (
        <EmptyHome />
      )}

      {featured && featuredSessions.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs tracking-[0.22em] text-muted uppercase">Bound nights</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {featuredSessions.map((session) => {
              const scene = scenes.find((s) => s.sessionId === session.id);
              return (
                <Link
                  key={session.id}
                  to="/tome/$campaignId/session/$sessionId"
                  params={{ campaignId: featured.id, sessionId: session.id }}
                  className="group overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]"
                >
                  {scene ? (
                    <img
                      src={scene.imageUrl}
                      alt=""
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : null}
                  <div className="p-4">
                    <p className="text-xs text-subtle">
                      Session {session.number} · {formatPlayed(session.playedOn)}
                    </p>
                    <h2 className="mt-1 font-display text-xl text-fg">{session.title}</h2>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {campaigns.length > 1 ? (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <p className="text-xs tracking-[0.22em] text-muted uppercase">Other tomes</p>
          <div className="mt-6 grid gap-3">
            {campaigns.slice(1).map((c) => (
              <Link
                key={c.id}
                to="/tome/$campaignId"
                params={{ campaignId: c.id }}
                className="flex items-center justify-between rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]"
              >
                <div>
                  <p className="font-display text-lg">{c.name}</p>
                  <p className="text-sm text-muted">{c.world}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EmptyHome() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4">
      <h1 className="font-display text-4xl">A table, remembered</h1>
      <p className="mt-4 text-muted leading-relaxed">
        Record a session. Ember Tome listens, keeps the faces straight, and paints
        what happened so the campaign has somewhere to live after the dice stop.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link to="/new">Begin a campaign</Link>
      </Button>
    </main>
  );
}
