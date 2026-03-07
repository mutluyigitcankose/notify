import { Skeleton } from "@/components/ui/skeleton";

export function EventSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-48 w-full rounded-[28px]" />
      <Skeleton className="h-48 w-full rounded-[28px]" />
      <Skeleton className="h-48 w-full rounded-[28px]" />
    </div>
  );
}
