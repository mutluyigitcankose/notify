import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { WikimediaEvent } from "@/types/wikimedia";

export function EventCard({
  event,
  categoryLabel,
}: {
  event: WikimediaEvent;
  categoryLabel: string;
}) {
  const page = event.pages?.[0];
  const image = page?.thumbnail?.source;
  const articleUrl = page?.content_urls?.desktop?.page ?? page?.content_urls?.mobile?.page;

  return (
    <Card className="grid gap-4 md:grid-cols-[1fr_160px]">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{categoryLabel}</Badge>
          {event.year ? <Badge className="bg-[var(--accent)] text-white">{event.year}</Badge> : null}
        </div>
        <p className="text-base leading-7 text-[var(--foreground)]">{event.text}</p>
        {page?.extract ? (
          <p className="text-sm leading-6 text-[var(--muted-foreground)]">{page.extract}</p>
        ) : null}
        {articleUrl ? (
          <Link
            href={articleUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
          >
            Devamını oku
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      {image ? (
        <div className="relative min-h-40 overflow-hidden rounded-3xl">
          <Image
            src={image}
            alt={page?.title ?? "Wikipedia görseli"}
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
      ) : null}
    </Card>
  );
}
