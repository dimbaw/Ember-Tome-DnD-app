import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, MapPin, Mic, Users } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

export function CampaignShell({
  campaignId,
  campaignName,
  children,
}: {
  campaignId: string;
  campaignName: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    {
      to: "/tome/$campaignId" as const,
      label: "Chronicle",
      icon: BookOpen,
      match: (p: string) =>
        p === `/tome/${campaignId}` || p.startsWith(`/tome/${campaignId}/session`),
    },
    {
      to: "/tome/$campaignId/party" as const,
      label: "Party",
      icon: Users,
      match: (p: string) => p.startsWith(`/tome/${campaignId}/party`),
    },
    {
      to: "/tome/$campaignId/places" as const,
      label: "Places",
      icon: MapPin,
      match: (p: string) => p.startsWith(`/tome/${campaignId}/places`),
    },
    {
      to: "/tome/$campaignId/record" as const,
      label: "Record",
      icon: Mic,
      match: (p: string) => p.startsWith(`/tome/${campaignId}/record`),
    },
  ];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-4">
            <Wordmark />
            <span className="hidden text-subtle sm:inline">/</span>
            <span className="hidden truncate font-display text-base text-muted sm:inline">
              {campaignName}
            </span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  params={{ campaignId }}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-lg px-3 text-sm transition-colors",
                    active ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 md:pb-16">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="grid grid-cols-4">
          {items.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.label}
                to={item.to}
                params={{ campaignId }}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-xs",
                  active ? "text-fg" : "text-muted",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
