import { NextResponse } from "next/server";
import { getEventsForDate, pickNotificationItems } from "@/lib/dal/events";
import {
  getActiveSubscriptions,
  handleNotificationFailure,
  handleNotificationSuccess,
  logNotificationResult,
} from "@/lib/dal/subscriptions";
import { sendPushNotification } from "@/lib/push/send-notification";
import { verifyCronSecret } from "@/lib/security/cron-auth";
import { getMonthDayInIstanbul } from "@/lib/utils/date";
import type { WikimediaCategory } from "@/types/wikimedia";

function allowedCategories(settings: {
  notifyEvents: boolean;
  notifyBirths: boolean;
  notifyDeaths: boolean;
  notifyHolidays: boolean;
}): WikimediaCategory[] {
  return [
    settings.notifyEvents ? "events" : null,
    settings.notifyBirths ? "births" : null,
    settings.notifyDeaths ? "deaths" : null,
    settings.notifyHolidays ? "holidays" : null,
    "selected",
  ].filter(Boolean) as WikimediaCategory[];
}

function getCurrentTimeInTimezone(timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export async function POST(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  const { month, day } = getMonthDayInIstanbul();

  try {
    const dailyEvents = await getEventsForDate(month, day);
    const subscriptions = await getActiveSubscriptions();

    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const subscription of subscriptions) {
      if (getCurrentTimeInTimezone(subscription.settings.timezone) !== subscription.settings.notifyTime) {
        skipped += 1;
        await logNotificationResult({
          subscriptionId: subscription.id,
          month,
          day,
          status: "skipped",
          errorMessage: "Bildirim saati uyuşmadı.",
        });
        continue;
      }

      const items = pickNotificationItems(
        dailyEvents,
        allowedCategories(subscription.settings),
      );

      if (items.length === 0) {
        skipped += 1;
        await logNotificationResult({
          subscriptionId: subscription.id,
          month,
          day,
          status: "skipped",
        });
        continue;
      }

      const payload = {
        title: `${day}/${month} Tarihte Bugün`,
        body: items
          .map(({ item }) => `${item.year ? `${item.year}: ` : ""}${item.text}`)
          .join(" • ")
          .slice(0, 240),
        url: `/date/${month}/${day}`,
        tag: `daily-history-${month}-${day}`,
      };

      const result = await sendPushNotification(subscription, payload);

      if (result.success) {
        sent += 1;
        await handleNotificationSuccess(subscription.id);
        await logNotificationResult({
          subscriptionId: subscription.id,
          month,
          day,
          status: "sent",
          payload,
        });
        continue;
      }

      const expired = result.statusCode === 404 || result.statusCode === 410;
      const nextFailureCount = expired ? 5 : subscription.failureCount + 1;
      failed += 1;
      await handleNotificationFailure(
        subscription.id,
        nextFailureCount,
        expired || nextFailureCount >= 5,
      );
      await logNotificationResult({
        subscriptionId: subscription.id,
        month,
        day,
        status: expired ? "expired" : "failed",
        errorMessage: result.error,
        payload,
      });
    }

    return NextResponse.json({ sent, failed, skipped, month, day });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
