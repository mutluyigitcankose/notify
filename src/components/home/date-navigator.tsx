import Link from "next/link";
import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdjacentDates } from "@/lib/utils/date";

export function DateNavigator({ month, day }: { month: number; day: number }) {
  const { previous, next } = getAdjacentDates(month, day);
  const randomDay = ((month * 31 + day * 7) % 28) + 1;
  const randomMonth = ((month + day) % 12) + 1;

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" asChild>
        <Link href={`/date/${previous.month}/${previous.day}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Önceki gün
        </Link>
      </Button>
      <Button variant="secondary" asChild>
        <Link href={`/date/${next.month}/${next.day}`}>
          Sonraki gün
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href={`/date/${randomMonth}/${randomDay}`}>
          <Shuffle className="mr-2 h-4 w-4" />
          Rastgele tarih
        </Link>
      </Button>
    </div>
  );
}
