import { z } from "zod";
import { isValidMonthDay } from "@/lib/utils/date";

export const dateParamsSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
}).refine((value) => isValidMonthDay(value.month, value.day), {
  message: "Geçersiz takvim tarihi.",
});

export const eventSearchSchema = z.object({
  q: z.string().trim().min(2).max(120),
  month: z.coerce.number().int().min(1).max(12).optional(),
  day: z.coerce.number().int().min(1).max(31).optional(),
});

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
  settings: z
    .object({
      notifyEvents: z.boolean().default(true),
      notifyBirths: z.boolean().default(true),
      notifyDeaths: z.boolean().default(true),
      notifyHolidays: z.boolean().default(true),
      notifyTime: z.string().regex(/^\d{2}:\d{2}$/),
      timezone: z.string().min(1),
    })
    .optional(),
});

export const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
});
