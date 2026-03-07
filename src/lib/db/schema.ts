import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const eventsCache = pgTable(
  "events_cache",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    month: integer("month").notNull(),
    day: integer("day").notNull(),
    category: text("category").notNull(),
    data: jsonb("data").notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
    staleAt: timestamp("stale_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("events_cache_date_category_idx").on(
      table.month,
      table.day,
      table.category,
    ),
    index("events_cache_stale_idx").on(table.staleAt),
  ],
);

export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userAgent: text("user_agent"),
    isActive: boolean("is_active").notNull().default(true),
    lastSuccessAt: timestamp("last_success_at", { withTimezone: true }),
    failureCount: integer("failure_count").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    index("push_sub_active_idx").on(table.isActive),
    index("push_sub_endpoint_idx").on(table.endpoint),
  ],
);

export const userSettings = pgTable(
  "user_settings",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    subscriptionId: integer("subscription_id")
      .notNull()
      .references(() => pushSubscriptions.id, { onDelete: "cascade" }),
    notifyEvents: boolean("notify_events").notNull().default(true),
    notifyBirths: boolean("notify_births").notNull().default(true),
    notifyDeaths: boolean("notify_deaths").notNull().default(true),
    notifyHolidays: boolean("notify_holidays").notNull().default(true),
    notifyTime: text("notify_time").notNull().default("09:00"),
    timezone: text("timezone").notNull().default("Europe/Istanbul"),
    ...timestamps,
  },
  (table) => [uniqueIndex("user_settings_sub_idx").on(table.subscriptionId)],
);

export const notificationLog = pgTable(
  "notification_log",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    subscriptionId: integer("subscription_id").references(() => pushSubscriptions.id, {
      onDelete: "set null",
    }),
    month: integer("month").notNull(),
    day: integer("day").notNull(),
    status: text("status").notNull(),
    errorMessage: text("error_message"),
    payload: jsonb("payload"),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
    ...timestamps,
  },
  (table) => [
    index("notif_log_date_idx").on(table.month, table.day),
    index("notif_log_status_idx").on(table.status),
    index("notif_log_sent_idx").on(table.sentAt),
  ],
);

export const insertEventsCacheSchema = createInsertSchema(eventsCache);
export const selectEventsCacheSchema = createSelectSchema(eventsCache);
export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions);
export const insertUserSettingsSchema = createInsertSchema(userSettings);
