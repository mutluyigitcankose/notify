"use client";

import { useEffect, useState } from "react";
import type { DailyEventsPayload } from "@/types/events";

export function useEvents(month: number, day: number) {
  const [data, setData] = useState<DailyEventsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/events/${month}/${day}`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Veri alınamadı.");
        }

        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [month, day]);

  return { data, loading, error };
}
