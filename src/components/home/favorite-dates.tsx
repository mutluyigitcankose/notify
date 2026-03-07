"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useFavoriteDates } from "@/hooks/use-favorite-dates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FavoriteDates({
  month,
  day,
  label,
}: {
  month: number;
  day: number;
  label: string;
}) {
  const { items, isFavorite, toggle } = useFavoriteDates();
  const isSaved = isFavorite(month, day);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Favori Tarihler
          </div>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Sonradan dönmek istediğiniz günleri burada saklayın.
          </p>
        </div>
        <Button
          variant={isSaved ? "default" : "secondary"}
          onClick={() => toggle({ month, day, label })}
        >
          {isSaved ? (
            <BookmarkCheck className="mr-2 h-4 w-4" />
          ) : (
            <Bookmark className="mr-2 h-4 w-4" />
          )}
          {isSaved ? "Kaydedildi" : "Favorilere ekle"}
        </Button>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Link
              key={`${item.month}-${item.day}`}
              href={`/date/${item.month}/${item.day}`}
              className="rounded-full bg-black/5 px-4 py-2 text-sm dark:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">
          Henüz favori tarih eklenmedi.
        </p>
      )}
    </Card>
  );
}
