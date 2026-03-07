import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DailyEventsPayload } from "@/types/events";

export function DailyDigest({ payload }: { payload: DailyEventsPayload }) {
  return (
    <Card className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <Badge>Günlük Özet</Badge>
        <h3 className="mt-4 font-serif text-3xl font-semibold">
          Bugünün tarih yoğunluğu
        </h3>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <StatCard label="Toplam kayıt" value={payload.stats.totalEvents} />
          <StatCard label="Dolu kategori" value={payload.stats.categoriesWithContent} />
          <StatCard label="En eski yıl" value={payload.stats.earliestYear ?? "Yok"} />
          <StatCard label="En yeni yıl" value={payload.stats.latestYear ?? "Yok"} />
        </div>
      </div>
      <div>
        <div className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Hızlı bakış
        </div>
        <div className="mt-4 grid gap-3">
          {payload.highlights.map((highlight, index) => (
            <div
              key={`${highlight.category}-${index}`}
              className="rounded-3xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {highlight.label}
              </div>
              <p className="mt-2 text-sm leading-6">
                {highlight.year ? `${highlight.year}: ` : ""}
                {highlight.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-3xl bg-black/5 p-4 dark:bg-white/5">
      <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
