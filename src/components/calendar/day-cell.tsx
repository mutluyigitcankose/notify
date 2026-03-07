import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function DayCell({
  date,
  selected,
  today,
  favorite,
}: {
  date: Date;
  selected?: boolean;
  today?: boolean;
  favorite?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 flex-col items-center justify-center rounded-2xl text-sm transition-colors",
        selected &&
          "bg-[var(--accent)] text-white shadow-[0_4px_14px_var(--accent),0_0_20px_rgba(221,107,66,0.35)] dark:shadow-[0_4px_14px_var(--accent),0_0_24px_rgba(237,143,86,0.4)]",
        today && !selected && "bg-[var(--muted)] text-[var(--foreground)]",
        !selected && "shadow-none",
      )}
    >
      <span className="relative">
        {date.getDate()}
        {favorite ? (
          <Heart
            className={cn(
              "absolute -right-2 -top-1 h-3 w-3 fill-current",
              selected ? "text-white" : "text-[var(--accent)]",
            )}
          />
        ) : null}
      </span>
      {selected ? (
        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/90" />
      ) : null}
    </div>
  );
}
