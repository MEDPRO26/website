/* SOS Santé partner SW — bump SW_VERSION when changing push behavior. */
const SW_VERSION = "sos-push-v4";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
    })()
  );
});

self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  let data = {
    title: "SOS Santé",
    body: "Vous avez une nouvelle notification.",
    url: "/fournisseurs",
    tag: "sos-sante",
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      data = {
        title: String(parsed.title || data.title),
        body: String(parsed.body || data.body),
        url: String(parsed.url || data.url),
        tag: String(parsed.tag || data.tag),
      };
    }
  } catch {
    try {
      const text = event.data?.text();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          data = {
            title: String(parsed.title || data.title),
            body: String(parsed.body || data.body),
            url: String(parsed.url || data.url),
            tag: String(parsed.tag || data.tag),
          };
        } catch {
          data.body = text;
        }
      }
    } catch {
      // keep defaults — still show a notification so the push is acknowledged
    }
  }

  // Always show a system notification, even if a tab is open.
  // That way partners still get a real OS banner when the app is closed.
  await self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/apple-touch-icon.png",
    badge: "/apple-touch-icon.png",
    tag: data.tag,
    renotify: true,
    requireInteraction: true,
    vibrate: [120, 80, 120],
    data: {
      url: data.url,
      version: SW_VERSION,
    },
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/fournisseurs";
  const absolute =
    targetUrl.startsWith("http://") || targetUrl.startsWith("https://")
      ? targetUrl
      : new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of allClients) {
        if ("focus" in client) {
          await client.focus();
          if ("navigate" in client) {
            try {
              await client.navigate(absolute);
            } catch {
              // navigate may fail on older browsers
            }
          }
          return;
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(absolute);
      }
    })()
  );
});
