import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DailyEventsPayload } from "@/types/events";

type PathCard = {
  title: string;
  duration: string;
  description: string;
  href: string;
};

function buildPaths(payload: DailyEventsPayload): PathCard[] {
  const selected = payload.groups.find((group) => group.category === "selected")?.items[0];
  const earliest = payload.groups
    .flatMap((group) => group.items)
    .filter((item) => typeof item.year === "number")
    .sort((left, right) => (left.year ?? 0) - (right.year ?? 0))[0];
  const latest = payload.groups
    .flatMap((group) => group.items)
    .filter((item) => typeof item.year === "number")
    .sort((left, right) => (right.year ?? 0) - (left.year ?? 0))[0];

  return [
    {
      title: "1 dakikalık başlangıç",
      duration: "1 dk",
      description: selected?.text ?? payload.featured?.text ?? "Bugünün öne çıkan kaydıyla başla.",
      href:
        selected?.pages?.[0]?.content_urls?.desktop?.page ??
        selected?.pages?.[0]?.content_urls?.mobile?.page ??
        `/date/${payload.month}/${payload.day}`,
    },
    {
      title: "En eski kaydı oku",
      duration: "3 dk",
      description:
        earliest?.text ?? "Günün en eski tarihli kaydına gidip başlangıç noktasını gör.",
      href:
        earliest?.pages?.[0]?.content_urls?.desktop?.page ??
        earliest?.pages?.[0]?.content_urls?.mobile?.page ??
        `/date/${payload.month}/${payload.day}`,
    },
    {
      title: "En yeni kaydı oku",
      duration: "5 dk",
      description:
        latest?.text ?? "Günün en yakın tarihli kaydıyla modern döneme bağlan.",
      href:
        latest?.pages?.[0]?.content_urls?.desktop?.page ??
        latest?.pages?.[0]?.content_urls?.mobile?.page ??
        `/date/${payload.month}/${payload.day}`,
    },
  ];
}

export function ReadingPaths({ payload }: { payload: DailyEventsPayload }) {
  const paths = buildPaths(payload);

  return (
    <section className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Okuma Rotaları
        </div>
        <h3 className="mt-2 font-serif text-3xl font-semibold">
          Aynı güne farklı tempolarda gir
        </h3>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {paths.map((path) => (
          <Card key={path.title} className="flex h-full flex-col justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                <Clock3 className="h-3.5 w-3.5" />
                {path.duration}
              </div>
              <h4 className="mt-3 text-xl font-semibold">{path.title}</h4>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                {path.description}
              </p>
            </div>
            <Link
              href={path.href}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
              target={path.href.startsWith("http") ? "_blank" : undefined}
              rel={path.href.startsWith("http") ? "noreferrer" : undefined}
            >
              Rotayı aç
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
