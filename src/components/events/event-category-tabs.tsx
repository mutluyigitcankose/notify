"use client";

import { EventList } from "@/components/events/event-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EventGroup } from "@/types/events";

export function EventCategoryTabs({ groups }: { groups: EventGroup[] }) {
  const defaultValue = groups.find((group) => group.items.length > 0)?.category ?? groups[0]?.category;

  if (!defaultValue) {
    return null;
  }

  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="mt-4 mb-5 p-2.5">
        {groups.map((group) => (
          <TabsTrigger key={group.category} value={group.category}>
            {group.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.map((group) => (
        <TabsContent key={group.category} value={group.category}>
          <EventList group={group} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
