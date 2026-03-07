import { EventCard } from "@/components/events/event-card";
import type { EventGroup } from "@/types/events";

export function EventList({ group }: { group: EventGroup }) {
  if (group.items.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-black/15 p-8 text-sm text-[var(--muted-foreground)] dark:border-white/15">
        Bu kategori için bugün içerik bulunamadı.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {group.items.map((event, index) => (
        <EventCard
          key={`${group.category}-${event.text.slice(0, 24)}-${index}`}
          event={event}
          categoryLabel={group.label}
        />
      ))}
    </div>
  );
}
