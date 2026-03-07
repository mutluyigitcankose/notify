export interface PushSubscriptionInput {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationSettingsInput {
  notifyEvents: boolean;
  notifyBirths: boolean;
  notifyDeaths: boolean;
  notifyHolidays: boolean;
  notifyTime: string;
  timezone: string;
}
