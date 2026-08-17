/* SOS Santé partner SW — bump SW_VERSION when changing push behavior. */
const SW_VERSION = "sos-push-v5";
const ICON_CACHE = `sos-push-icons-${SW_VERSION}`;
const PRECACHE_URLS = [
  "/notification-badge.png",
  "/favicon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(ICON_CACHE);
      await Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => undefined)
        )
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("sos-push-icons-") && key !== ICON_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!PRECACHE_URLS.includes(url.pathname)) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event));
});

function parsePushData(event) {
  const fallback = {
    title: "SOS Santé",
    body: "Nouvelle demande à traiter.",
    url: "/fournisseurs",
    tag: `sos-${Date.now()}`,
  };

  if (!event.data) return fallback;

  try {
    const parsed = event.data.json();
    return {
      title: String(parsed.title || fallback.title),
      body: String(parsed.body || fallback.body),
      url: String(parsed.url || fallback.url),
      tag: String(parsed.tag || fallback.tag),
    };
  } catch {
    try {
      const text = event.data.text();
      if (!text) return fallback;
      try {
        const parsed = JSON.parse(text);
        return {
          title: String(parsed.title || fallback.title),
          body: String(parsed.body || fallback.body),
          url: String(parsed.url || fallback.url),
          tag: String(parsed.tag || fallback.tag),
        };
      } catch {
        return { ...fallback, body: text };
      }
    } catch {
      return fallback;
    }
  }
}

async function showPushNotification(data) {
  const origin = self.location.origin;
  const options = {
    body: data.body,
    icon: `${origin}/favicon-512.png`,
    badge: `${origin}/notification-badge.png`,
    tag: data.tag,
    renotify: true,
    silent: false,
    data: {
      url: data.url,
      version: SW_VERSION,
    },
  };

  try {
    await self.registration.showNotification(data.title, options);
    return;
  } catch (err) {
    console.error("showNotification with icons failed", err);
  }

  // If icon fetch/options fail while Chrome is asleep, still show a banner.
  await self.registration.showNotification(data.title, {
    body: data.body,
    tag: data.tag,
    renotify: true,
    data: { url: data.url, version: SW_VERSION },
  });
}

async function handlePush(event) {
  const data = parsePushData(event);
  await showPushNotification(data);
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
