"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ShareDateCard({
  month,
  day,
  label,
}: {
  month: number;
  day: number;
  label: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  async function share() {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/date/${month}/${day}`;
    const text = `${label} için Tarihte Bugün içeriğini incele: ${url}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Tarihte Bugün - ${label}`,
          text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(text);
      }

      setMessage("Paylaşım bağlantısı hazır.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Paylaş
        </div>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Bu tarih sayfasını tek tıkla paylaşın veya panoya kopyalayın.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => void share()}>
          <Share2 className="mr-2 h-4 w-4" />
          Bu tarihi paylaş
        </Button>
        {message ? <span className="text-sm text-[var(--muted-foreground)]">{message}</span> : null}
      </div>
    </Card>
  );
}
