import { cn } from "@/lib/utils/cn";

export function DayCell({
  date,
  selected,
  today,
}: {
  date: Date;
  selected?: boolean;
  today?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 flex-col items-center justify-center rounded-2xl text-sm transition",
        selected && "bg-[var(--accent)] text-white",
        today && !selected && "bg-[var(--muted)] text-[var(--foreground)]",
      )}
    >
      <span>{date.getDate()}</span>
      <span className={cn("mt-1 h-1.5 w-1.5 rounded-full", selected ? "bg-white" : "bg-[var(--accent)]")} />
    </div>
  );
}
