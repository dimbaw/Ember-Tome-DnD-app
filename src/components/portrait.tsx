import { cn } from "@/lib/utils";
import type { Character } from "@/lib/types";

export function Portrait({
  character,
  className,
  sizes = "160px",
}: {
  character: Pick<Character, "name" | "portraitUrl">;
  className?: string;
  sizes?: string;
}) {
  return (
    <img
      src={character.portraitUrl}
      alt={character.name}
      sizes={sizes}
      className={cn(
        "h-full w-full object-cover object-top",
        className,
      )}
    />
  );
}

export function PortraitStack({
  characters,
}: {
  characters: Pick<Character, "id" | "name" | "portraitUrl">[];
}) {
  return (
    <div className="flex -space-x-3">
      {characters.slice(0, 6).map((c) => (
        <div
          key={c.id}
          className="size-10 overflow-hidden rounded-full ring-2 ring-bg"
        >
          <Portrait character={c} sizes="40px" />
        </div>
      ))}
    </div>
  );
}
