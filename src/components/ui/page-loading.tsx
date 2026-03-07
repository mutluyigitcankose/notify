import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PageLoading() {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-6 py-16"
      role="status"
      aria-live="polite"
      aria-label="Sayfa yükleniyor"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--muted-foreground)]" />
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Yükleniyor
        </p>
      </div>
      <div className="grid w-full max-w-2xl gap-4">
        <Skeleton className="h-32 w-full rounded-[28px]" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
        <Skeleton className="h-24 w-full rounded-[28px]" />
      </div>
    </div>
  );
}
