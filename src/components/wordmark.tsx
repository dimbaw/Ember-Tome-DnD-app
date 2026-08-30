import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5 text-fg no-underline", className)}
    >
      <svg
        viewBox="0 0 32 32"
        className="size-7"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="7" fill="currentColor" className="text-elevated" />
        <rect x="8" y="9" width="16" height="15" rx="1.5" fill="#161411" />
        <rect x="7" y="9" width="4" height="15" rx="1.2" fill="#9c9286" />
        <rect x="11" y="9.5" width="1.4" height="14" fill="#ece6dc" />
      </svg>
      <span className="font-display text-lg tracking-tight">Ember Tome</span>
    </Link>
  );
}
