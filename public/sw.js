self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    tag: data.tag || "daily-history",
    renotify: true,
    data: {
      url: data.url || "/",
    },
    actions: [
      { action: "open", title: "Detayları Gör" },
      { action: "dismiss", title: "Kapat" },
    ],
    vibrate: [100, 50, 100],
    lang: "tr",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((items) => {
      for (const client of items) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }

      return clients.openWindow(url);
    }),
  );
});
